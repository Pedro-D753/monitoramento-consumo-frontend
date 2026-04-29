import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useFocusEffect } from 'expo-router';
import { ConsumptionRecord } from '../schemas/ConsumptionSchema';
import { descriptionCache } from '@/config/DescriptionCache';
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
    // ✅ Bug #9: Ignora re-fetch se os dados ainda são "frescos" e não é forçado
    if (!force && now - lastFetchRef.current < STALE_MS && entries.length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await getConsumos(type);

      // ✅ Bug #16: Usa o singleton descriptionCache em vez de chamar storage diretamente
      const localDescriptions = await descriptionCache.getAll();
      const mergedData = data.map((item) => ({
        ...item,
        description: localDescriptions[item.id] || item.description,
      }));

      setEntries(mergedData);
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

      // Re-aplica a descrição local para não desaparecer após a edição
      const localDescriptions = await descriptionCache.getAll();
      const mergedUpdated = {
        ...updated,
        description: localDescriptions[updated.id] || updated.description,
      };

      setEntries((prev) =>
        prev.map((entry) => (entry.id === id ? mergedUpdated : entry)),
      );
      return mergedUpdated;
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