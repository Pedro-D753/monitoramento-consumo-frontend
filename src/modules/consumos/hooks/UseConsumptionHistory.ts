import { useState, useRef, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import axios from "axios";
import { descriptionCache } from "@/config/DescriptionCache";
import {
  ConsumptionRecord,
  ChartDataPoint,
  ConsumptionFilters,
  parseApiDate,
} from "../schemas/ConsumptionSchema";
import { getConsumos } from "../services/ConsumptionService";
import { formatToMonthlyChartData } from "../utils/ChartUtils";

const STALE_MS = 15_000;

export function useConsumptionHistory() {
  const [cachedData, setCachedData]   = useState<ConsumptionRecord[]>([]);
  const [filteredData, setFilteredData] = useState<ConsumptionRecord[]>([]);
  const [chartData, setChartData]     = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const lastFetchRef                  = useRef<number>(0);

  const fetchHistory = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchRef.current < STALE_MS && cachedData.length > 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const raw = await getConsumos("real");
      const localDescriptions = await descriptionCache.getAll();
      const mergedData = raw.map((item) => ({
        ...item,
        description: localDescriptions[item.id] || item.description,
      }));

      setCachedData(mergedData);
      setFilteredData(mergedData);
      setChartData(formatToMonthlyChartData(mergedData));
      lastFetchRef.current = Date.now();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setCachedData([]);
          setFilteredData([]);
          setChartData([]);
          return;
        }
        const detail = err.response?.data?.detail;
        setError(
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? detail[0]?.msg || "Falha na validação dos dados."
              : "Falha ao carregar dados.",
        );
      } else {
        setError("Falha ao carregar dados.");
      }
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetch = useCallback(async () => {
    await fetchHistory(true);
  }, [fetchHistory]);

  const applyLocalFilters = useCallback(
    (filters: ConsumptionFilters) => {
      let result = [...cachedData];

      if (filters.si_measurement_unit) {
        const target = filters.si_measurement_unit.trim().toLowerCase();
        result = result.filter(
          (i) => i.si_measurement_unit.trim().toLowerCase() === target,
        );
      }
      if (filters.starting_date) {
        const start = parseApiDate(filters.starting_date).getTime();
        result = result.filter((i) => parseApiDate(i.ending_date).getTime() >= start);
      }
      if (filters.ending_date) {
        const end = parseApiDate(filters.ending_date).getTime();
        result = result.filter((i) => parseApiDate(i.ending_date).getTime() <= end);
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
      fetchHistory(false);
    }, [fetchHistory]),
  );

  return {
    data: chartData,
    rawData: filteredData,
    isLoading,
    error,
    refetch,
    applyLocalFilters,
  };
}