import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { PageLayout } from '@/components/layout/PageLayout';
import { Typography } from '@/components/ui/Typography';
import { ConsumptionBarChart } from '@/components/ui/ConsumptionBarChart';
import { SimulationLineChart } from '@/components/ui/SimulationLineChart';
import { ConsumptionCard, ConsumptionType } from '@/components/ui/ConsumptionCard';
import { BottomSheetModal } from '@/components/ui/BottomSheetModal';
import { theme } from '@/config/Theme';

import { useConsumptionHistory } from '@/modules/consumos/hooks/UseConsumptionHistory';
import { ConsumptionRecord, formatDateToApi, parseApiDate } from '@/modules/consumos/schemas/ConsumptionSchema';
import { EditConsumptionForm } from '@/modules/consumos/components/EditConsumptionForm';
import { HistoryFilterCard } from '@/modules/consumos/components/HistoryFilterCard';
import { deleteConsumo } from '@/modules/consumos/services/ConsumptionService';

const getCardType = (measurementUnit: string): ConsumptionType => {
  const unit = measurementUnit.toLowerCase();
  if (unit.includes('r$')) return 'money';
  if (unit.includes('kwh') || unit.includes('wh')) return 'energy';
  if (unit.includes('m³') || unit.includes('m3') || unit.includes('gas')) return 'gas';
  if (unit === 'l' || unit.includes('litro')) return 'water';
  return 'other';
};

export default function HistoryScreen() {
  const router = useRouter();
  const { data, rawData, isLoading, error, applyLocalFilters, refetch } = useConsumptionHistory();

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [unit, setUnit] = useState<string>('');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [editingRecord, setEditingRecord] = useState<ConsumptionRecord | null>(null);

  const handleApplyFilters = () => {
    applyLocalFilters({
      starting_date: startDate ? formatDateToApi(startDate) : undefined,
      ending_date: endDate ? formatDateToApi(endDate) : undefined,
      si_measurement_unit: unit || undefined,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteConsumo('real', id);
      await refetch();
      handleApplyFilters();
    } catch (err) {
      console.error('Erro ao deletar consumo:', err);
    }
  };

  const handleEditSuccess = async () => {
    setEditingRecord(null);
    await refetch();
    handleApplyFilters();
  };

  return (
    <>
      <PageLayout showHeader={false}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Typography variant="bold" size="xl">Histórico Completo</Typography>
        </View>

        <View style={styles.chartArea}>
          <View style={styles.chartHeader}>
            <Typography variant="bold" size="md">
              {chartType === 'bar' ? 'Volume de Consumo' : 'Tendência de Consumo'}
            </Typography>
          </View>
          <Typography
            variant="regular"
            size="xs"
            color={theme.colors.primary.main}
            style={styles.chartHint}
          >
            (Toque no gráfico para alterar)
          </Typography>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setChartType((prev) => (prev === 'bar' ? 'line' : 'bar'))}
            style={styles.chartTouchable}
          >
            {chartType === 'bar' ? (
              <ConsumptionBarChart data={data} isLoading={isLoading} />
            ) : (
              <SimulationLineChart data={data} isLoading={isLoading} />
            )}
          </TouchableOpacity>
        </View>

        <HistoryFilterCard
          startDate={startDate}
          endDate={endDate}
          unit={unit}
          isLoading={isLoading}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onUnitChange={setUnit}
          onApply={handleApplyFilters}
        />

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
          <Typography variant="bold" size="lg" style={styles.listTitle}>
            Resultados ({rawData.length})
          </Typography>

          {rawData.length === 0 && !isLoading ? (
            <Typography
              variant="regular"
              align="center"
              color={theme.colors.text.disabled}
              style={styles.emptyText}
            >
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
                  onEdit={() => setEditingRecord(consumo)}
                  onDelete={() => handleDelete(consumo.id)}
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray[900],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  headerContainer: {
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  chartArea: {
    marginBottom: theme.spacing.lg,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing.md,
  },
  chartHint: {
    marginBottom: 10,
    marginTop: -10,
  },
  chartTouchable: {
    borderRadius: theme.borderRadius.md,
  },
  errorText: {
    marginBottom: theme.spacing.md,
  },
  listSection: {
    paddingBottom: 40,
  },
  listTitle: {
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    marginTop: 20,
  },
});