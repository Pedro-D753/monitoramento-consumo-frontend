import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { PageLayout } from '@/components/layout/PageLayout';
import { Typography } from '@/components/ui/Typography';
import { theme } from '@/config/Theme';

import { useConsumptionHistory } from '@/modules/consumos/hooks/UseConsumptionHistory';
import { ConsumptionBarChart } from '@/components/ui/ConsumptionBarChart';
import { SimulationLineChart } from '@/components/ui/SimulationLineChart'; // Importamos o gráfico de linha
import { ConsumptionCard, ConsumptionType } from '@/components/ui/ConsumptionCard';
import { Button } from '@/components/ui/Button';
import { DatePickerInput } from '@/components/ui/DatePickerInput';
import { SelectInput } from '@/components/ui/SelectInput';

const UNIT_OPTIONS = [
  { label: 'Todas as Unidades', value: '' }, 
  { label: 'Energia (kWh)', value: 'kWh' },
  { label: 'Água/Líquidos (L)', value: 'L' },
  { label: 'Gás (m³)', value: 'm³' },
  { label: 'Financeiro (R$)', value: 'R$' },
];

const formatLocalToApi = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function HistoryScreen() {
  const { data, rawData, isLoading, applyLocalFilters } = useConsumptionHistory();

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [unit, setUnit] = useState<string>('');
  
  // Novo Estado: Controla qual gráfico está sendo exibido
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const handleApplyFilters = () => {
    applyLocalFilters({
      starting_date: startDate ? formatLocalToApi(startDate) : undefined,
      ending_date: endDate ? formatLocalToApi(endDate) : undefined,
      measurement_unit: unit || undefined, 
    });
  };

  // Função para alternar entre os gráficos
  const toggleChart = () => {
    setChartType((prev) => (prev === 'bar' ? 'line' : 'bar'));
  };

  return (
    <PageLayout userName="User" showHeader={false}>
      <View style={styles.header}>
        <Typography variant="bold" size="xl">Histórico Completo</Typography>
        <Typography variant="regular" size="sm" color={theme.colors.text.secondary}>
          Acompanhe e filtre seus registros
        </Typography>
      </View>
      

      {/* 1. Área de Gráficos (Interativa) */}
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

      {/* 2. Painel de Filtros */}
      <View style={styles.filterCard}>
        <Typography variant="bold" size="md" style={styles.filterTitle}>
          Filtrar Dados
        </Typography>
        
        <View style={styles.filterRow}>
          <View style={{ flex: 1, marginRight: theme.spacing.sm }}>
            <DatePickerInput label="Data Inicial" customValue=' ' value={startDate} onChange={setStartDate} />
          </View>
          <View style={{ flex: 1 }}>
            <DatePickerInput label="Data Final" customValue=' ' value={endDate} onChange={setEndDate} />
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

      {/* 3. Lista de Registros */}
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
            let cardType: ConsumptionType = 'other';
            const unitLower = consumo.measurement_unit.toLowerCase();
            if (unitLower.includes('l') || unitLower.includes('m³')) cardType = 'water';
            else if (unitLower.includes('kwh') || unitLower.includes('w')) cardType = 'energy';
            else if (unitLower.includes('r$')) cardType = 'money';
            else if (unitLower.includes('gas')) cardType = 'gas';

            const dateStr = new Date(consumo.ending_date).toLocaleDateString('pt-BR');

            return (
              <ConsumptionCard
                key={consumo.id.toString()}
                id={consumo.id}
                description={consumo.description} 
                type={cardType}
                title={`Consumo de ${consumo.measurement_unit}`}
                value={consumo.value}
                unit={consumo.measurement_unit}
                date={dateStr}
              />
            );
          })
        )}
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: theme.spacing.lg },
  chartArea: { marginBottom: theme.spacing.lg },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing.md,
  },
  chartTouchable: {
    // Adiciona um feedback visual leve ao redor da área de clique se desejado
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
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  listSection: { paddingBottom: 40 }
});