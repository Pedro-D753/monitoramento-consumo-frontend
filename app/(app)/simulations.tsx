import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
import { getUnitLabel } from '@/modules/consumos/utils/UnitUtils';
import { formatToMonthlyChartData } from '@/modules/consumos/utils/ChartUtils';

const getDailyProjection = (startStr: string, endStr: string, totalValue: number): number => {
  const diffTime = Math.abs(parseApiDate(endStr).getTime() - parseApiDate(startStr).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? totalValue / diffDays : totalValue;
};

const getSimulationColor = (unit: string): string => {
  const lower = unit.toLowerCase();
  if (lower.includes('kwh') || lower.includes('wh')) return '#f1c40f'; // Energia (Amarelo)
  if (lower === 'l' || lower.includes('litro')) return '#3498db';      // Água (Azul)
  if (lower.includes('m³') || lower.includes('m3')) return '#e74c3c';  // Gás (Vermelho)
  if (lower.includes('r$')) return '#0bc53a';                          // Dinheiro (Verde)
  return theme.colors.primary.main; // Cor padrão caso não identifique
};

export default function SimulationsScreen() {
  const router = useRouter()
  const { simulations, isLoading, removeSimulation, refetchSimulations } = useSimulations();
  const [editingSimulation, setEditingSimulation] = useState<ConsumptionRecord | null>(null);
  
  // Estado para gerenciar qual filtro está ativo
  const [activeUnit, setActiveUnit] = useState<string>('all');

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

  // Filtra as simulações pela unidade selecionada
  const filteredSimulations = activeUnit === 'all' 
    ? simulations 
    : simulations.filter(sim => sim.si_measurement_unit.toLowerCase().includes(activeUnit.toLowerCase()));

  // O gráfico recebe os dados filtrados e já divididos ao longo dos meses correspondentes!
  const distributedChartData = formatToMonthlyChartData(filteredSimulations);

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
          <View>
            <Typography variant="bold" size="xl">Simulações</Typography>
            <Typography variant="regular" size="sm" color={theme.colors.text.secondary}>
              Projeções e cenários de consumo futuro
            </Typography>
          </View>
        </View>

        {/* NOVA SEÇÃO DE FILTRO: Chips Horizontais */}
        <View style={styles.filtersContainer}>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
              {['Todas', 'kWh', 'L', 'm³', 'R$'].map(unit => {
                const filterKey = unit === 'Todas' ? 'all' : unit;
                const isActive = activeUnit === filterKey;
                
                return (
                  <TouchableOpacity 
                    key={unit} 
                    onPress={() => setActiveUnit(filterKey)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: isActive ? theme.colors.primary.main : theme.colors.card.subCard,
                        borderColor: isActive ? theme.colors.primary.main : theme.colors.border,
                      }
                    ]}
                  >
                    <Typography variant="medium" size="sm" color={isActive ? '#fff' : theme.colors.text.secondary}>
                      {unit}
                    </Typography>
                  </TouchableOpacity>
                )
              })}
           </ScrollView>
        </View>

        <View style={styles.chartWrapper}>
          <SimulationLineChart data={distributedChartData} isLoading={isLoading} />
        </View>

        <View style={styles.listSection}>
          {isLoading ? (
            <Typography variant="regular" align="center" color={theme.colors.text.disabled} style={styles.stateText}>
              A calcular projeções...
            </Typography>
          ) : filteredSimulations.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="trending-up" size={48} color={theme.colors.text.disabled} style={styles.emptyIcon} />
              <Typography variant="regular" align="center" color={theme.colors.text.secondary}>
                Nenhuma simulação encontrada.
              </Typography>
              <Typography variant="regular" size="sm" align="center" color={theme.colors.primary.main} style={styles.emptyHint}>
                Vá ao Dashboard e use o botão "Simulação" para criar cenários.
              </Typography>
            </View>
          ) : (
            filteredSimulations.map((sim) => {
              const startDateStr = parseApiDate(sim.starting_date).toLocaleDateString('pt-BR');
              const endDateStr   = parseApiDate(sim.ending_date).toLocaleDateString('pt-BR');
              const dailyRate    = getDailyProjection(sim.starting_date, sim.ending_date, sim.value);
              const unitLabel    = getUnitLabel(sim.si_measurement_unit);

              // 🎯 Capturamos a cor dinâmica baseada na unidade de medida da simulação atual
              const headerColor  = getSimulationColor(sim.si_measurement_unit);

              return (
                <View key={sim.id.toString()} style={styles.simulationCard}>
                  
                  {/* 🎯 Aplicamos a cor dinâmica no background do Header */}
                  <View style={[styles.cardHeader, { backgroundColor: headerColor }]}>
                    <View style={styles.iconWrapper}>
                      
                      {/* 🎯 Aplicamos a cor dinâmica no Ícone para combinar */}
                      <Feather name="activity" size={20} color={headerColor} />
                    </View>
                    <View style={{ flex: 1 }}>
                      
                      {/* 🎯 Adicionamos branco absoluto ao título para contrastar com qualquer cor de fundo */}
                      <Typography variant="bold" size="md" color="#ffffff">
                        Cenário de {unitLabel}
                      </Typography>
                      
                      <Typography variant="regular" size="xs" color="#f0f0f0"> {/* Cinza clarinho para melhor leitura */}
                        {startDateStr} a {endDateStr}
                      </Typography>
                    </View>
                    <View style={styles.cardActions}>
                      <Typography
                        variant="regular" size="xs"
                        style={styles.actionBtn}
                        onPress={() => setEditingSimulation(sim)}
                      >
                        <Feather name="edit-2" size={16} color="#ffffff" />
                      </Typography>
                      <Typography
                        variant="regular" size="xs"
                        style={styles.actionBtn}
                        onPress={() => handleDelete(sim.id)}
                      >
                        <Feather name="trash-2" size={16} color="#ffffff" />
                      </Typography>
                    </View>
                  </View>

                  <View style={styles.dataGrid}>
                    <View style={styles.dataBox}>
                      <Typography variant="regular" size="xs" color={theme.colors.text.secondary} style={styles.label}>
                        Total Estimado
                      </Typography>
                      <Typography variant="bold" size="lg" color={theme.colors.text.primary}>
                        {sim.value}{' '}
                        <Typography variant="medium" size="sm" color={theme.colors.text.secondary}>
                          {sim.si_measurement_unit}
                        </Typography>
                      </Typography>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.dataBox}>
                      <Typography variant="regular" size="xs" color={theme.colors.text.secondary} style={styles.label}>
                        Ritmo Diário
                      </Typography>
                      <Typography variant="bold" size="lg" color={theme.colors.status.warning}>
                        ~{dailyRate.toFixed(2)}{' '}
                        <Typography variant="medium" size="sm" color={theme.colors.text.secondary}>
                          {sim.si_measurement_unit}/dia
                        </Typography>
                      </Typography>
                    </View>
                  </View>
                </View>
              );
            })
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  filtersContainer: {
    marginBottom: theme.spacing.lg,
  },
  filtersScroll: {
    paddingRight: theme.spacing.lg, // Dá um pequeno respiro no final do scroll
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  chartWrapper:  { marginBottom: theme.spacing.lg },
  listSection:   { paddingBottom: 110 },
  stateText:     { marginTop: 40 },
  emptyState:    { marginTop: 60, alignItems: 'center', padding: theme.spacing.xl },
  emptyIcon:     { marginBottom: 16 },
  emptyHint:     { marginTop: 8 },
  simulationCard: {
    backgroundColor: theme.colors.card.subCard,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  iconWrapper: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: theme.colors.card.subCard,
    justifyContent: 'center', alignItems: 'center',
    marginRight: theme.spacing.sm,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  cardActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  actionBtn: { padding: 6 },
  dataGrid:  { flexDirection: 'row', padding: theme.spacing.md },
  dataBox:   { flex: 1, justifyContent: 'center' },
  divider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
  },
  label: { marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray[900],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});