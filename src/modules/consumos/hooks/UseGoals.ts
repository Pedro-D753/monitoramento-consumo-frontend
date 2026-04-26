import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { ConsumptionRecord } from '../schemas/ConsumptionSchema';
import { 
  getConsumos, 
  deleteConsumo, 
  editConsumo, 
  EditConsumptionPayload 
} from '../services/ConsumptionService';


export function useGoals() {
  const [goals, setGoals] = useState<ConsumptionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    try {
      setIsLoading(true);
      // Utilizando o Service centralizado passando o tipo "goal"
      const data = await getConsumos("goal");
      setGoals(data);
    } catch (error) {
      console.log("Erro ao buscar metas (ou lista vazia).");
    } finally {
      setIsLoading(false);
    }
  }, []);
  const removeGoal = async (id: number) => {
    try {
      await deleteConsumo("goal", id);
      // Atualização otimista ou refetch
      setGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (error) {
      console.error("Erro ao deletar simulação", error);
      throw error;
    }
  };

  const updateGoal = async (id: number, payload: EditConsumptionPayload) => {
    try {
      const updated = await editConsumo("goal", id, payload);
      setGoals(prev => prev.map(goal => goal.id === id ? updated : goal));
      return updated;
    } catch (error) {
      console.error("Erro ao editar simulação", error);
      throw error;
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGoals();
    }, [fetchGoals])
  );

  return { 
    goals, 
    isLoading, 
    refetchGoals: fetchGoals,
    removeGoal, // <--- Exportar
    updateGoal  // <--- Exportar
  };
}