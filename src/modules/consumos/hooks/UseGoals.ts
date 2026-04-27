import { useEntries } from './UseEntries';
import { EditConsumptionPayload } from '../services/ConsumptionService';
import { ConsumptionRecord } from '../schemas/ConsumptionSchema';

export function useGoals() {
  const { entries, isLoading, refetch, removeEntry, updateEntry } = useEntries('goal');

  return {
    goals: entries,
    isLoading,
    refetchGoals: refetch,
    removeGoal: (id: number): Promise<void> => removeEntry(id),
    updateGoal: (id: number, payload: EditConsumptionPayload): Promise<ConsumptionRecord> =>
      updateEntry(id, payload),
  };
}