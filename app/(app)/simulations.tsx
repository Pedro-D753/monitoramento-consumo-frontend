import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { PageLayout } from '@/components/layout/PageLayout';
import { BottomSheetModal } from '@/components/ui/BottomSheetModal';
import { SimulationLineChart } from '@/components/ui/SimulationLineChart';
import { Typography } from '@/components/ui/Typography';
import { theme } from '@/config/Theme';

import { useSimulations } from '@/modules/consumos/hooks/UseSimulations';
import { ConsumptionRecord, ChartDataPoint, parseApiDate } from '@/modules/consumos/schemas/ConsumptionSchema';
import { SimulationCard } from '@/modules/consumos/components/SimulationCard';
import { EditConsumptionForm } from '@/modules/consumos/components/EditConsumptionForm';

const getDailyProjection = (startStr: string, endStr: string, totalValue: number): number => {
  const diffTime = Math.abs(parseApiDate(endStr).getTime() - parseApiDate(startStr).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? totalValue / diffDays : totalValue;
};

const buildChartData = (simulations: ConsumptionRecord[]): ChartDataPoint[] =>
  [...simulations]
    .sort((a, b) => parseApiDate(a.starting_date).getTime() - parseApiDate(b.starting_date).getTime())
    .map((sim) => {
      const date       = parseApiDate(sim.starting_date);
      const monthLabel = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
      return {
        value:      sim.value,
        label:      `${monthLabel}/${String(date.getFullYear()).slice(-2)}`,
        frontColor: theme.colors.primary.main,
      };
    });

export default function SimulationsScreen() {
  const { simulations, isLoading, removeSimulation, refetchSimulations } = useSimulations();
  const [editingSimulation, setEditingSimulation] = useState<ConsumptionRecord | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await removeSimulation(id);
    } catch (error) {
      console.error('Erro ao deletar simulação:', error);
    }
  };

  const handleEditSuccess = async () => {
    setEditingSimulation(null);
    await refetchSimulations();
  };

  return (
    <>
      <PageLayout showHeader={false}>
        <View style={styles.headerContainer}>
          <View>
            <Typography variant="bold" size="xl">Simulações</Typography>
            <Typography variant="regular" size="sm" color={theme.colors.text.secondary}>
              Projeções e cenários de consumo futuro
            </Typography>
          </View>
        </View>

        <View style={styles.chartWrapper}>
          <SimulationLineChart data={buildChartData(simulations)} isLoading={isLoading} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {isLoading ? (
            <Typography variant="regular" align="center" color={theme.colors.text.disabled} style={styles.stateText}>
              A calcular projeções...
            </Typography>
          ) : simulations.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="trending-up" size={48} color={theme.colors.text.disabled} style={styles.emptyIcon} />
              <Typography variant="regular" align="center" color={theme.colors.text.secondary}>
                Nenhuma simulação ativa no momento.
              </Typography>
              <Typography variant="regular" size="sm" align="center" color={theme.colors.primary.main} style={styles.emptyHint}>
                Vá ao Dashboard e use o botão "Simulação" para criar cenários.
              </Typography>
            </View>
          ) : (
            simulations.map((sim) => (
              <SimulationCard
                key={sim.id.toString()}
                simulation={sim}
                dailyRate={getDailyProjection(sim.starting_date, sim.ending_date, sim.value)}
                onEdit={() => setEditingSimulation(sim)}
                onDelete={() => handleDelete(sim.id)}
              />
            ))
          )}
        </ScrollView>
      </PageLayout>

      <BottomSheetModal
        visible={!!editingSimulation}
        onClose={() => setEditingSimulation(null)}
        title="Editar Simulação"
      >
        {editingSimulation && (
          <EditConsumptionForm
            type="simulation"
            record={editingSimulation}
            onSuccess={handleEditSuccess}
            onCancel={() => setEditingSimulation(null)}
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
  chartWrapper:  { marginBottom: theme.spacing.lg },
  scrollContent: { paddingBottom: 110 },
  stateText:     { marginTop: 40 },
  emptyState:    { marginTop: 60, alignItems: 'center', padding: theme.spacing.xl },
  emptyIcon:     { marginBottom: 16 },
  emptyHint:     { marginTop: 8 },
});