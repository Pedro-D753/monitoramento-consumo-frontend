
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import axios from "axios";
import {
  ConsumptionRecord,
  ChartDataPoint,
  ConsumptionFilters,
  parseApiDate,
} from "../schemas/ConsumptionSchema";
import { getConsumos } from "../services/ConsumptionService";
import { formatToMonthlyChartData } from "../utils/ChartUtils";

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
      const raw = await getConsumos("real");
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
      if (filters.si_measurement_unit) {
        const targetUnit = filters.si_measurement_unit.trim().toLowerCase();
        result = result.filter(
          (i) => i.si_measurement_unit.trim().toLowerCase() === targetUnit
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

useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [fetchHistory])
  );

  return {
    data: chartData,
    rawData: filteredData,
    isLoading,
    error,
    refetch: fetchHistory,
    applyLocalFilters,
  };
}
