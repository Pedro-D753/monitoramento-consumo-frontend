import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useFocusEffect } from 'expo-router';
import { ConsumptionRecord } from '../schemas/ConsumptionSchema';
import {
  getConsumos,
  deleteConsumo,
  editConsumo,
  EditConsumptionPayload,
  EntryType,
} from '../services/ConsumptionService';

/** Tempo mínimo entre fetches automáticos (ao focar a tela) */
const STALE_MS = 15_000; // 15 segundos

interface UseEntriesResult {
  entries: ConsumptionRecord[];
  isLoading: boolean;
  refetch: () => Promise<void>;
  removeEntry: (id: number) => Promise<void>;
  updateEntry: (id: number, payload: EditConsumptionPayload) => Promise<ConsumptionRecord>;
}

export function useEntries(type: EntryType): UseEntriesResult {
  const [entries, setEntries]     = useState<ConsumptionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const lastFetchRef              = useRef<number>(0);

  const fetchEntries = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchRef.current < STALE_MS && entries.length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await getConsumos(type);
      
      setEntries(data);
      lastFetchRef.current = Date.now();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setEntries([]);
      } else {
        console.error(`Erro ao buscar entradas do tipo "${type}":`, err);
        setEntries([]);
      }
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  /** Força um novo fetch, ignorando o stale time (usar após mutations) */
  const refetch = useCallback(async () => {
    await fetchEntries(true);
  }, [fetchEntries]);

  const removeEntry = useCallback(async (id: number): Promise<void> => {
    await deleteConsumo(type, id);
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, [type]);

  const updateEntry = useCallback(
    async (id: number, payload: EditConsumptionPayload): Promise<ConsumptionRecord> => {
      const updated = await editConsumo(type, id, payload);

      setEntries((prev) =>
        prev.map((entry) => (entry.id === id ? updated : entry)),
      );
      
      return updated;
    },
    [type],
  );

  // useFocusEffect respeita o stale time para evitar double fetch
  useFocusEffect(
    useCallback(() => {
      fetchEntries(false);
    }, [fetchEntries]),
  );

  return { entries, isLoading, refetch, removeEntry, updateEntry };
}