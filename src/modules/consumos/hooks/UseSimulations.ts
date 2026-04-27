import { useEntries } from './UseEntries';
import { EditConsumptionPayload } from '../services/ConsumptionService';
import { ConsumptionRecord } from '../schemas/ConsumptionSchema';

export function useSimulations() {
  const { entries, isLoading, refetch, removeEntry, updateEntry } = useEntries('simulation');

  return {
    simulations: entries,
    isLoading,
    refetchSimulations: refetch,
    removeSimulation: (id: number): Promise<void> => removeEntry(id),
    updateSimulation: (id: number, payload: EditConsumptionPayload): Promise<ConsumptionRecord> =>
      updateEntry(id, payload),
  };
}