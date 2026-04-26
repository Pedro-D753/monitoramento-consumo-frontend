import { useState, useEffect, useCallback } from 'react';
import { ConsumptionRecord } from '../schemas/ConsumptionSchema';
import { getConsumos } from '../services/ConsumptionService';

export function useSimulations() {
  const [simulations, setSimulations] = useState<ConsumptionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSimulations = useCallback(async () => {
    try {
      setIsLoading(true);
      // Utilizando o Service centralizado passando o tipo "simulation"
      const data = await getConsumos("simulation");
      setSimulations(data);
    } catch (error) {
      // Falha silenciosa: a lista vazia já será tratada como Empty State na UI
      console.log("Erro ao buscar simulações (ou lista vazia).");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSimulations();
  }, [fetchSimulations]);

  return { simulations, isLoading, refetchSimulations: fetchSimulations };
}