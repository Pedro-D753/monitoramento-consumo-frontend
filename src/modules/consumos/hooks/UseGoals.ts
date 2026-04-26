import { useState, useEffect, useCallback } from 'react';
import { ConsumptionRecord } from '../schemas/ConsumptionSchema';
import { getConsumos } from '../services/ConsumptionService';

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

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return { goals, isLoading, refetchGoals: fetchGoals };
}