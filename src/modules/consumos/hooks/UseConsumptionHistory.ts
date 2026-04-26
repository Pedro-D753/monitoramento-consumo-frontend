import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { theme } from "@/config/Theme";
import {
  ConsumptionRecord,
  ChartDataPoint,
  ConsumptionFilters,
  parseApiDate,
} from "../schemas/ConsumptionSchema";
import { getConsumos } from "../services/ConsumptionService";

const getUnitColor = (unit: string): string => {
  const normalizedUnit = unit.toLowerCase();
  if (normalizedUnit.includes("r$")) {
    return theme.colors.status.success;
  }
  if (normalizedUnit.includes("kwh") || normalizedUnit.includes("wh")) {
    return theme.colors.status.warning;
  }
  if (normalizedUnit === "l" || normalizedUnit.includes("litro")) {
    return theme.colors.status.info;
  }
  if (normalizedUnit.includes("m³") || normalizedUnit.includes("m3")) {
    return theme.colors.primary.light;
  }

  return theme.colors.primary.main;
};

const formatToMonthlyChartData = (
  records: ConsumptionRecord[],
): ChartDataPoint[] => {
  // A chave usa ano e mês para não misturar, por exemplo, jan/25 com jan/26.
  const monthlyData: Record<
    string,
    ChartDataPoint & { sortKey: string; unitSignature: string }
  > = {};

  records
    .slice()
    .sort(
      (left, right) =>
        parseApiDate(left.ending_date).getTime() -
        parseApiDate(right.ending_date).getTime(),
    )
    .forEach((record) => {
      const date = parseApiDate(record.ending_date);
      const sortKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}`;
      const monthLabel = date
        .toLocaleString("pt-BR", { month: "short" })
        .replace(".", "");
      const label = `${monthLabel.charAt(0).toUpperCase()}${monthLabel.slice(
        1,
      )}/${String(date.getFullYear()).slice(-2)}`;

      if (!monthlyData[sortKey]) {
        monthlyData[sortKey] = {
          sortKey,
          unitSignature: record.measurement_unit.toLowerCase(),
          label,
          value: 0,
          frontColor: getUnitColor(record.measurement_unit),
        };
      } else if (
        monthlyData[sortKey].unitSignature !==
        record.measurement_unit.toLowerCase()
      ) {
        monthlyData[sortKey].frontColor = theme.colors.primary.main;
      }

      monthlyData[sortKey].value += record.value;
    });

  return Object.values(monthlyData)
    .sort((left, right) => left.sortKey.localeCompare(right.sortKey))
    .map(({ sortKey: _sortKey, unitSignature: _unitSignature, ...point }) => {
      return point;
    });
};

export function useConsumptionHistory() {
  const [cachedData, setCachedData] = useState<ConsumptionRecord[]>([]);
  const [filteredData, setFilteredData] = useState<ConsumptionRecord[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const raw = await getConsumos();
      setCachedData(raw);
      setFilteredData(raw);
      setChartData(formatToMonthlyChartData(raw));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        let errorMessage = "Falha ao carregar dados.";
          // 404 cai aqui e vira mensagem de erro na tela
          if (err.response?.status === 404) {
            setCachedData([]);
            setFilteredData([]);
            setChartData([]);
            return; // Lista vazia é estado válido, não erro
          }

        if (typeof detail === 'string') {
            errorMessage = detail;
        } else if (Array.isArray(detail)) {
            // Se for o erro 422 do FastAPI, pegamos a mensagem do primeiro erro
            errorMessage = detail[0]?.msg || "Falha na validação dos dados.";
        }
        
        setError(errorMessage);
      } else {
        setError("Falha ao carregar dados.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyLocalFilters = useCallback(
    (filters: ConsumptionFilters) => {
      // Os filtros são aplicados localmente sobre o cache já carregado da API.
      let result = [...cachedData];
      if (filters.measurement_unit) {
        result = result.filter(
          (i) => i.measurement_unit === filters.measurement_unit,
        );
      }
      if (filters.starting_date) {
        const start = parseApiDate(filters.starting_date).getTime();
        result = result.filter(
          (i) => parseApiDate(i.ending_date).getTime() >= start,
        );
      }
      if (filters.ending_date) {
        const end = parseApiDate(filters.ending_date).getTime();
        result = result.filter(
          (i) => parseApiDate(i.ending_date).getTime() <= end,
        );
      }
      if (filters.minimum_value !== undefined) {
        result = result.filter((i) => i.value >= filters.minimum_value!);
      }
      if (filters.maximum_value !== undefined) {
        result = result.filter((i) => i.value <= filters.maximum_value!);
      }
      setFilteredData(result);
      setChartData(formatToMonthlyChartData(result));
    },
    [cachedData],
  );

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    data: chartData,
    rawData: filteredData,
    isLoading,
    error,
    refetch: fetchHistory,
    applyLocalFilters,
  };
}
