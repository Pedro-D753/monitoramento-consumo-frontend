import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { PageLayout } from '@/components/layout/PageLayout';
import { BottomSheetModal } from '@/components/ui/BottomSheetModal';
import { Typography } from '@/components/ui/Typography';
import { theme } from '@/config/Theme';

import { useGoals } from '@/modules/consumos/hooks/UseGoals';
import { useConsumptionHistory } from '@/modules/consumos/hooks/UseConsumptionHistory';
import { ConsumptionRecord, parseApiDate } from '@/modules/consumos/schemas/ConsumptionSchema';
import { GoalProgressCard } from '@/modules/consumos/components/GoalProgressCard';
import { EditConsumptionForm } from '@/modules/consumos/components/EditConsumptionForm';

// Função pura extraída do componente — sem dependências de estado
const calculateProgress = (goal: ConsumptionRecord, rawData: ConsumptionRecord[]) => {
  const goalStart = parseApiDate(goal.starting_date).getTime();
  const goalEnd   = parseApiDate(goal.ending_date).getTime();

  const currentSpent = rawData
    .filter((c) => c.si_measurement_unit === goal.si_measurement_unit)
    .filter((c) => {
      const cDate = parseApiDate(c.ending_date).getTime();
      return cDate >= goalStart && cDate <= goalEnd;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  const percentage = Math.min((currentSpent / goal.value) * 100, 100);
  const isOverLimit = currentSpent > goal.value;

  return { currentSpent, percentage, isOverLimit };
};

export default function GoalsScreen() {
  const { goals, isLoading: loadingGoals, removeGoal, refetchGoals } = useGoals();
  const { rawData, isLoading: loadingHistory } = useConsumptionHistory();
  const [editingGoal, setEditingGoal] = useState<ConsumptionRecord | null>(null);

  const isLoading = loadingGoals || loadingHistory;

  const handleDelete = async (id: number) => {
    try {
      await removeGoal(id);
    } catch (error) {
      console.error('Erro ao deletar meta:', error);
    }
  };

  const handleEditSuccess = async () => {
    setEditingGoal(null);
    await refetchGoals();
  };

  return (
    <>
      <PageLayout showHeader={false}>
        <View style={styles.headerContainer}>
          <View>
            <Typography variant="bold" size="xl">Metas de Consumo</Typography>
            <Typography variant="regular" size="sm" color={theme.colors.text.secondary}>
              Acompanhe os seus limites estabelecidos
            </Typography>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {isLoading ? (
            <Typography variant="regular" align="center" color={theme.colors.text.disabled} style={styles.stateText}>
              Analisando as suas metas...
            </Typography>
          ) : goals.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="target" size={48} color={theme.colors.text.disabled} style={styles.emptyIcon} />
              <Typography variant="regular" align="center" color={theme.colors.text.secondary}>
                Você não possui nenhuma meta ativa.
              </Typography>
              <Typography variant="regular" size="sm" align="center" color={theme.colors.primary.main} style={styles.emptyHint}>
                Volte ao Dashboard para criar.
              </Typography>
            </View>
          ) : (
            goals.map((goal) => {
              const progress = calculateProgress(goal, rawData);
              return (
                <GoalProgressCard
                  key={goal.id.toString()}
                  goal={goal}
                  currentSpent={progress.currentSpent}
                  percentage={progress.percentage}
                  isOverLimit={progress.isOverLimit}
                  onEdit={() => setEditingGoal(goal)}
                  onDelete={() => handleDelete(goal.id)}
                />
              );
            })
          )}
        </ScrollView>
      </PageLayout>

      <BottomSheetModal
        visible={!!editingGoal}
        onClose={() => setEditingGoal(null)}
        title="Editar Meta"
      >
        {editingGoal && (
          <EditConsumptionForm
            type="goal"
            record={editingGoal}
            onSuccess={handleEditSuccess}
            onCancel={() => setEditingGoal(null)}
          />
        )}
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  scrollContent: { paddingBottom: 110 },
  stateText:   { marginTop: 40 },
  emptyState:  { marginTop: 60, alignItems: 'center', padding: theme.spacing.xl },
  emptyIcon:   { marginBottom: 16 },
  emptyHint:   { marginTop: 8 },
});