import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { PageLayout } from '@/components/layout/PageLayout';
import { Typography } from '@/components/ui/Typography';
import { theme } from '@/config/Theme';

import { useGoals } from '@/modules/consumos/hooks/UseGoals';
import { useConsumptionHistory } from '@/modules/consumos/hooks/UseConsumptionHistory';
import { ConsumptionRecord, parseApiDate } from '@/modules/consumos/schemas/ConsumptionSchema';

interface GoalCardProps {
  // ... suas props existentes (id, title, type, etc)
  type: 'water' | 'electricity' | 'gas'; 
  onDelete?: () => void; // Callback opcional
}

export default function GoalsScreen() {
  const { goals, isLoading: loadingGoals } = useGoals();
  const { rawData, isLoading: loadingHistory } = useConsumptionHistory();

  const calculateProgress = (goal: ConsumptionRecord) => {
    const goalStart = parseApiDate(goal.starting_date).getTime();
    const goalEnd = parseApiDate(goal.ending_date).getTime();

    const currentSpent = rawData
      .filter((c) => c.si_measurement_unit === goal.si_measurement_unit)
      .filter((c) => {
        const cDate = parseApiDate(c.ending_date).getTime();
        return cDate >= goalStart && cDate <= goalEnd;
      })
      .reduce((acc, curr) => acc + curr.value, 0);

    const percentage = Math.min((currentSpent / goal.value) * 100, 100);
    const isOverLimit = currentSpent > goal.value;
    const cType = (goal.si_measurement_unit.toLowerCase)

    return { currentSpent, percentage, isOverLimit, cType };
  };

  const isLoading = loadingGoals || loadingHistory;


  return (
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
          <Typography variant="regular" align="center" color={theme.colors.text.disabled} style={{ marginTop: 40 }}>
            Analisando as suas metas...
          </Typography>
        ) : goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="target" size={48} color={theme.colors.text.disabled} style={{ marginBottom: 16 }} />
            <Typography variant="regular" align="center" color={theme.colors.text.secondary}>
              Você não possui nenhuma meta ativa.
            </Typography>
            <Typography variant="regular" size="sm" align="center" color={theme.colors.primary.main} style={{ marginTop: 8 }}>
              Volte ao Dashboard e use o botão "+" para criar.
            </Typography>
          </View>
        ) : (
          goals.map((goal) => {
            const { currentSpent, percentage, isOverLimit } = calculateProgress(goal);
            
            let barColor = theme.colors.primary.main;
            if (percentage >= 85 && !isOverLimit) barColor = theme.colors.status.warning;
            if (isOverLimit) barColor = theme.colors.danger.main;

            const endDate = parseApiDate(goal.ending_date).toLocaleDateString('pt-BR');

            return (
              <View key={goal.id.toString()} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <Typography variant="bold" size="lg">
                    Meta de {goal.si_measurement_unit}
                  </Typography>
                  <Typography variant="regular" size="xs" color={theme.colors.text.secondary}>
                    Válida até {endDate}
                  </Typography>
                </View>

                <View style={styles.progressTextContainer}>
                  <Typography variant="medium" size="md" color={isOverLimit ? theme.colors.danger.main : theme.colors.text.primary}>
                    {currentSpent} / {goal.value} {goal.si_measurement_unit}
                  </Typography>
                  <Typography variant="bold" size="md" color={barColor}>
                    {percentage?.toFixed(1)}%
                  </Typography>
                </View>

                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: barColor }]} />
                </View>

                {isOverLimit && (
                  <Typography variant="regular" size="xs" color={theme.colors.danger.main} style={{ marginTop: 8 }}>
                    Atenção: Você ultrapassou o limite projetado!
                  </Typography>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </PageLayout>
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
  emptyState: { marginTop: 60, alignItems: 'center', padding: theme.spacing.xl },
  goalCard: {
    backgroundColor: theme.colors.card.subCard,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  progressBarBackground: {
    height: 10,
    width: '100%',
    backgroundColor: theme.colors.background.input,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  }
});