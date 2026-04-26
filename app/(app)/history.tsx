import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons'
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { PageLayout } from '@/components/layout/PageLayout';
import { Typography } from '@/components/ui/Typography';
import { theme } from '@/config/Theme';

import { useConsumptionHistory } from '@/modules/consumos/hooks/UseConsumptionHistory';
import { ConsumptionRecord, formatDateToApi, parseApiDate } from '@/modules/consumos/schemas/ConsumptionSchema';import { ConsumptionBarChart } from '@/components/ui/ConsumptionBarChart';
import { SimulationLineChart } from '@/components/ui/SimulationLineChart';
import { ConsumptionCard, ConsumptionType } from '@/components/ui/ConsumptionCard';
import { Button } from '@/components/ui/Button';
import { DatePickerInput } from '@/components/ui/DatePickerInput';
import { SelectInput } from '@/components/ui/SelectInput';


import { EditConsumptionForm } from '@/modules/consumos/components/EditConsumptionForm';
import { deleteConsumo } from '@/modules/consumos/services/ConsumptionService';
import { BottomSheetModal } from '@/components/ui/BottomSheetModal';

const UNIT_OPTIONS = [
  { label: 'Todas as Unidades', value: '' }, 
  { label: 'Energia (kWh)', value: 'kWh' },
  { label: 'Água/Líquidos (L)', value: 'L' },
  { label: 'Gás (m³)', value: 'm³' },
  { label: 'Financeiro (R$)', value: 'R$' },
];

export default function HistoryScreen() {
  const router = useRouter();
  const { data, rawData, isLoading, error, applyLocalFilters, refetch } =
    useConsumptionHistory();

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [unit, setUnit] = useState<string>('');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const handleApplyFilters = () => {
    applyLocalFilters({
      starting_date: startDate ? formatDateToApi(startDate) : undefined,
      ending_date: endDate ? formatDateToApi(endDate) : undefined,
      measurement_unit: unit || undefined, 
    });
  };

  const toggleChart = () => {
    setChartType((prev) => (prev === 'bar' ? 'line' : 'bar'));
  };

  const getCardType = (measurementUnit: string): ConsumptionType => {
    const unitLower = measurementUnit.toLowerCase();

    if (unitLower.includes('r$')) return 'money';
    if (unitLower.includes('kwh') || unitLower.includes('wh')) return 'energy';
    if (unitLower.includes('m³') || unitLower.includes('m3') || unitLower.includes('gas')) {
      return 'gas';
    }
    if (unitLower === 'l' || unitLower.includes('litro')) return 'water';

    return 'other';
  };

  const [editingRecord, setEditingRecord] = useState<ConsumptionRecord | null>(null);

const handleDelete = async (id: number) => {
  try {
    // Mantemos o 'real' explícito conforme refatoramos no Service
    await deleteConsumo('real', id);
    await refetch();
    handleApplyFilters(); // ← lê startDate/endDate/unit do closure atual — ok se estados não mudaram
  } catch (error) {
    console.error("Erro ao deletar consumo:", error);
    // Opcional: Adicionar um Toast/Alert de erro aqui
  }
};
  const handleEditSuccess = async () => {
    setEditingRecord(null); // Fecha o modal de edição
    await refetch();        // Espera os dados novos e atualizados chegarem do backend
    handleApplyFilters();   // Lê os filtros que estão na tela (Data/Unidade) e corta a lista novamente
  };

  return (
    <>
      <PageLayout showHeader={false}>
        <View>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerContainer}>
          <Typography variant="bold" size="xl">Histórico Completo</Typography>
        </View>

        <View style={styles.chartArea}>
          <View style={styles.chartHeader}>
            <Typography variant="bold" size="md">
              {chartType === 'bar' ? 'Volume de Consumo' : 'Tendência de Consumo'}
            </Typography>
          </View>

          <Typography variant="regular" size="xs" color={theme.colors.primary.main} style={{marginBottom: 10, marginTop: -10}}>
            (Toque no gráfico para alterar)
          </Typography>

          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={toggleChart} 
            style={styles.chartTouchable}
          >
            {chartType === 'bar' ? (
              <ConsumptionBarChart data={data} isLoading={isLoading} />
            ) : (
              <SimulationLineChart data={data} isLoading={isLoading} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.filterCard}>
          <Typography variant="bold" size="md" style={styles.filterTitle}>
            Filtrar Dados
          </Typography>
          
          <View style={styles.filterRow}>
            <View style={{ flex: 1, marginRight: theme.spacing.sm }}>
              <DatePickerInput
                label="Data Inicial"
                customValue=" "
                value={startDate}
                onChange={setStartDate}
              />
            </View>
            <View style={{ flex: 1 }}>
              <DatePickerInput
                label="Data Final"
                customValue=" "
                value={endDate}
                onChange={setEndDate}
              />
            </View>
          </View>

          <SelectInput
            label="Unidade de Medida"
            options={UNIT_OPTIONS}
            value={unit}
            onSelect={setUnit}
            placeholder="Selecione..."
          />

          <Button 
            title="Aplicar Filtros" 
            onPress={handleApplyFilters} 
            isLoading={isLoading}
            style={{ marginTop: theme.spacing.sm, width: '100%' }}
          />
        </View>

        {error && (
          <Typography
            variant="regular"
            size="sm"
            color={theme.colors.danger.main}
            style={styles.errorText}
          >
            {error}
          </Typography>
        )}

        <View style={styles.listSection}>
          <Typography variant="bold" size="lg" style={{ marginBottom: theme.spacing.md }}>
            Resultados ({rawData.length})
          </Typography>

          {rawData.length === 0 && !isLoading ? (
            <Typography variant="regular" align="center" color={theme.colors.text.disabled} style={{ marginTop: 20 }}>
              Nenhum consumo encontrado para estes filtros.
            </Typography>
          ) : (
            [...rawData].reverse().map((consumo) => {
              const dateStr = parseApiDate(consumo.ending_date).toLocaleDateString('pt-BR');

              return (
              <ConsumptionCard
                key={consumo.id.toString()}
                id={consumo.id}
                description={consumo.description}
                type={getCardType(consumo.si_measurement_unit)}
                title={consumo.si_measurement_unit}
                value={consumo.value}
                unit={consumo.si_measurement_unit}
                date={dateStr}
                onEdit={() => setEditingRecord(consumo)}       // ← novo
                onDelete={() => handleDelete(consumo.id)}      // ← novo
              />
              );
            })
          )}
        </View>
      </PageLayout>
      <BottomSheetModal
        visible={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        title="Editar Consumo"
      >
        {editingRecord && (
          <EditConsumptionForm
            type="real"
            record={editingRecord}
            onSuccess={handleEditSuccess}
            onCancel={() => setEditingRecord(null)}
          />
        )}
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'flex-start',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md
  },
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
  chartArea: { marginBottom: theme.spacing.lg },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing.md,
  },
  chartTouchable: {
    borderRadius: theme.borderRadius.md,
  },
  filterCard: {
    backgroundColor: theme.colors.card.subCard,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
  },
  filterTitle: { marginBottom: theme.spacing.md },
  errorText: { marginBottom: theme.spacing.md },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  listSection: { paddingBottom: 40 }
});
