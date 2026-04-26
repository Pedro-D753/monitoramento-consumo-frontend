import { useState, useCallback } from 'react';
import { useFocusEffect } from "expo-router";
import { ConsumptionRecord } from '../schemas/ConsumptionSchema';
import { 
  getConsumos, 
  deleteConsumo, 
  editConsumo, 
  EditConsumptionPayload 
} from '../services/ConsumptionService';

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
  const removeSimulation = async (id: number) => {
    try {
      await deleteConsumo("simulation", id);
      // Atualização otimista ou refetch
      setSimulations(prev => prev.filter(sim => sim.id !== id));
    } catch (error) {
      console.error("Erro ao deletar simulação", error);
      throw error;
    }
  };

  const updateSimulation = async (id: number, payload: EditConsumptionPayload) => {
    try {
      const updated = await editConsumo("simulation", id, payload);
      setSimulations(prev => prev.map(sim => sim.id === id ? updated : sim));
      return updated;
    } catch (error) {
      console.error("Erro ao editar simulação", error);
      throw error;
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSimulations();
    }, [fetchSimulations])
  );

  return { 
    simulations, 
    isLoading, 
    refetchSimulations: fetchSimulations,
    removeSimulation, // <--- Exportar
    updateSimulation  // <--- Exportar
  };
}