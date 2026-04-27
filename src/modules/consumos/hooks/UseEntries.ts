import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { ConsumptionRecord } from '../schemas/ConsumptionSchema';
import {
  getConsumos,
  deleteConsumo,
  editConsumo,
  EditConsumptionPayload,
  EntryType,
} from '../services/ConsumptionService';

interface UseEntriesResult {
  entries: ConsumptionRecord[];
  isLoading: boolean;
  refetch: () => Promise<void>;
  removeEntry: (id: number) => Promise<void>;
  updateEntry: (id: number, payload: EditConsumptionPayload) => Promise<ConsumptionRecord>;
}

export function useEntries(type: EntryType): UseEntriesResult {
  const [entries, setEntries] = useState<ConsumptionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getConsumos(type);
      setEntries(data);
    } catch {
      // Lista vazia é estado válido — falha silenciosa intencional
      console.log(`Nenhum registro encontrado para o tipo: ${type}`);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  const removeEntry = useCallback(async (id: number): Promise<void> => {
    await deleteConsumo(type, id);
    // Atualização otimista: não aguarda refetch
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, [type]);

  const updateEntry = useCallback(
    async (id: number, payload: EditConsumptionPayload): Promise<ConsumptionRecord> => {
      const updated = await editConsumo(type, id, payload);
      setEntries((prev) => prev.map((entry) => (entry.id === id ? updated : entry)));
      return updated;
    },
    [type],
  );

  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, [fetchEntries]),
  );

  return { entries, isLoading, refetch: fetchEntries, removeEntry, updateEntry };
}