import { useState, useCallback } from 'react';
import axios from 'axios';
import { useFocusEffect } from 'expo-router';
import { ConsumptionRecord } from '../schemas/ConsumptionSchema';
import { storage } from '@/config/Storage';
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

      // ✅ TODO FUTURE: Remover este cruzamento de dados quando o Backend enviar a "description"
      const localDescriptions = await storage.getDescriptions();
      const mergedData = data.map(item => ({
        ...item,
        description: localDescriptions[item.id] || item.description
      }));

      // 🎯 Correção: Salvar o mergedData no estado, não o data original
      setEntries(mergedData);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        // 404 = lista vazia = estado válido
        setEntries([]);
      } else {
        // Outros erros: lista vazia mas loga para debug
        console.error(`Erro ao buscar entradas do tipo "${type}":`, err);
        setEntries([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  const removeEntry = useCallback(async (id: number): Promise<void> => {
    await deleteConsumo(type, id);
    
    // Atualização otimista: remove da lista imediatamente
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, [type]);

  const updateEntry = useCallback(
    async (id: number, payload: EditConsumptionPayload): Promise<ConsumptionRecord> => {
      const updated = await editConsumo(type, id, payload);
      
      // ✅ 🎯 Re-aplica a descrição do cache no objeto atualizado, 
      // para evitar que ela suma da tela após a edição otimista
      const localDescriptions = await storage.getDescriptions();
      const mergedUpdated = {
          ...updated,
          description: localDescriptions[updated.id] || updated.description
      };

      setEntries((prev) => prev.map((entry) => (entry.id === id ? mergedUpdated : entry)));
      return mergedUpdated;
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