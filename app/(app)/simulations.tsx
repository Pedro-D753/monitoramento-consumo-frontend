import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { PageLayout } from '@/components/layout/PageLayout';
import { BottomSheetModal } from '@/components/ui/BottomSheetModal';
import { SimulationLineChart } from '@/components/ui/SimulationLineChart';
import { Typography } from '@/components/ui/Typography';
import { theme } from '@/config/Theme';

import { ViewSelector, ViewType } from '@/components/ui/ViewSelector';
import { useSimulations } from '@/modules/consumos/hooks/UseSimulations';
import { ConsumptionRecord, parseApiDate } from '@/modules/consumos/schemas/ConsumptionSchema';
import { EditConsumptionForm } from '@/modules/consumos/components/EditConsumptionForm';
import { SimulationCard } from '@/modules/consumos/components/SimulationCard';
import { SimulationFilterChips } from '@/modules/consumos/components/SimulationFilterChips';
import { formatToMonthlyChartData } from '@/modules/consumos/utils/ChartUtils';

/** Cor do cabeçalho do card baseada na unidade de medida */
const getHeaderColor = (unit: string): string => {
  const u = unit.toLowerCase();
  if (u.includes('kwh') || u.includes('wh')) return '#f1c40f';
  if (u === 'l' || u.includes('litro'))      return '#3498db';
  if (u.includes('m³') || u.includes('m3')) return '#e74c3c';
  if (u.includes('r$'))                      return '#0bc53a';
  return theme.colors.primary.main;
};

const getDailyProjection = (
  startStr: string,
  endStr: string,
  totalValue: number,
): number => {
  const diffTime = Math.abs(
    parseApiDate(endStr).getTime() - parseApiDate(startStr).getTime(),
  );
  const diffDays = Math.ceil(diffTime / 86_400_000) + 1;
  return diffDays > 0 ? totalValue / diffDays : totalValue;
};

export default function SimulationsScreen() {
  const router = useRouter();
  const { simulations, isLoading, removeSimulation, refetchSimulations } = useSimulations();
  const [editingSimulation, setEditingSimulation] = useState<ConsumptionRecord | null>(null);
  const [activeUnit, setActiveUnit]               = useState<string>('all');

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

  const handleViewChange = (view: ViewType) => {
    if (view !== 'simulations') router.replace(`/(app)/${view}`);
  };

  const filteredSimulations =
    activeUnit === 'all'
      ? simulations
      : simulations.filter((sim) =>
          sim.si_measurement_unit.toLowerCase().includes(activeUnit.toLowerCase()),
        );

  return (
    <>
      <PageLayout showHeader={false} scrollable={true}>
        <ViewSelector activeView="simulations" onSelect={handleViewChange} />

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Typography variant="bold" size="xl">Simulações</Typography>
          <Typography variant="regular" size="sm" color={theme.colors.text.secondary}>
            Projeções e cenários de consumo futuro
          </Typography>
        </View>

        {/* ✅ Bug #12: nestedScrollEnabled está dentro de SimulationFilterChips */}
        <SimulationFilterChips activeUnit={activeUnit} onSelect={setActiveUnit} />

        <View style={styles.chartWrapper}>
          <SimulationLineChart
            data={formatToMonthlyChartData(filteredSimulations)}
            isLoading={isLoading}
          />
        </View>

        <View style={styles.listSection}>
          {isLoading ? (
            <Typography
              variant="regular"
              align="center"
              color={theme.colors.text.disabled}
              style={styles.stateText}
            >
              A calcular projeções...
            </Typography>
          ) : filteredSimulations.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather
                name="trending-up"
                size={48}
                color={theme.colors.text.disabled}
                style={styles.emptyIcon}
              />
              <Typography variant="regular" align="center" color={theme.colors.text.secondary}>
                Nenhuma simulação encontrada.
              </Typography>
              <Typography
                variant="regular"
                size="sm"
                align="center"
                color={theme.colors.primary.main}
                style={styles.emptyHint}
              >
                Vá ao Dashboard e use o botão "Simulação" para criar cenários.
              </Typography>
            </View>
          ) : (
            filteredSimulations.map((sim) => (
              <SimulationCard
                key={sim.id.toString()}
                simulation={sim}
                dailyRate={getDailyProjection(sim.starting_date, sim.ending_date, sim.value)}
                headerColor={getHeaderColor(sim.si_measurement_unit)}
                onEdit={() => setEditingSimulation(sim)}
                onDelete={() => handleDelete(sim.id)}
              />
            ))
          )}
        </View>
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
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: theme.colors.gray[900],
    justifyContent: 'center', alignItems: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  headerContainer: {
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  chartWrapper:  { marginBottom: theme.spacing.lg },
  listSection:   { paddingBottom: 110 },
  stateText:     { marginTop: 40 },
  emptyState:    { marginTop: 60, alignItems: 'center', padding: theme.spacing.xl },
  emptyIcon:     { marginBottom: 16 },
  emptyHint:     { marginTop: 8 },
});