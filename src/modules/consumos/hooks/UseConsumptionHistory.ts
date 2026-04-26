import { useState, useEffect, useCallback } from "react";
import { getConsumos } from "../services/ConsumptionService";
import {
  ConsumptionRecord,
  ChartDataPoint,
  ConsumptionFilters,
} from "../schemas/ConsumptionSchema";
import { theme } from "@/config/Theme";

const getUnitColor = (unit: string): string => {
  const normalizedUnit = unit.toLowerCase();
  if (normalizedUnit.includes("l") || normalizedUnit.includes("m³")) {
    return theme.colors.status.info;
  }
  if (normalizedUnit.includes("kwh") || normalizedUnit.includes("w")) {
    return theme.colors.status.warning;
  }
  if (normalizedUnit.includes("r$")) {
    return theme.colors.status.success;
  }

  return theme.colors.primary.main;
};

const formatToMonthlyChartData = (
  records: ConsumptionRecord[],
): ChartDataPoint[] => {
  const monthlyData: Record<string, ChartDataPoint> = {};
  records.forEach((record) => {
    const date = new Date(record.ending_date);
    const monthLabel = date
      .toLocaleString("pt-BR", { month: "short" })
      .replace(".", "");
    const label = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
    if (!monthlyData[label]) {
      monthlyData[label] = {
        label,
        value: 0,
        frontColor: getUnitColor(record.measurement_unit),
      };
    }
    monthlyData[label].value += record.value;
  });
  return Object.values(monthlyData);
};

export function useConsumptionHistory() {
  const [cachedData, setCachedData] = useState<ConsumptionRecord[]>([]);
  const [filteredData, setFilteredData] = useState<ConsumptionRecord[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const raw = await getConsumos();
      setCachedData(raw);
      setFilteredData(raw);
      setChartData(formatToMonthlyChartData(raw));
    } catch (err) {
      setError("Falha ao carregar dados.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyLocalFilters = useCallback(
    (filters: ConsumptionFilters) => {
      let result = [...cachedData];
      if (filters.measurement_unit) {
        result = result.filter(
          (i) => i.measurement_unit === filters.measurement_unit,
        );
      }
      if (filters.starting_date) {
        const start = new Date(filters.starting_date).getTime();
        result = result.filter(
          (i) => new Date(i.ending_date).getTime() >= start,
        );
      }
      if (filters.ending_date) {
        const end = new Date(filters.ending_date).getTime();
        result = result.filter((i) => new Date(i.ending_date).getTime() <= end);
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
