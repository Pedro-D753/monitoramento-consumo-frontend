import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DatePickerInput } from '@/components/ui/DatePickerInput';
import { SelectInput } from '@/components/ui/SelectInput';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { theme } from '@/config/Theme';

const UNIT_OPTIONS = [
  { label: 'Todas as Unidades', value: '' },
  { label: 'Energia (kWh)', value: 'kWh' },
  { label: 'Água/Líquidos (L)', value: 'L' },
  { label: 'Gás (m³)', value: 'm³' },
  { label: 'Financeiro (R$)', value: 'R$' },
];

interface HistoryFilterCardProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  unit: string;
  isLoading: boolean;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onUnitChange: (unit: string) => void;
  onApply: () => void;
  onClear: () => void;
}

export function HistoryFilterCard({
  startDate,
  endDate,
  unit,
  isLoading,
  onStartDateChange,
  onEndDateChange,
  onUnitChange,
  onClear,
  onApply,
}: HistoryFilterCardProps) {
  return (
    <View style={styles.card}>
      <Typography variant="bold" size="md" style={styles.title}>
        Filtrar Dados
      </Typography>

      <View style={styles.row}>
        <View style={styles.rowItem}>
          <DatePickerInput
            label="Data Inicial"
            customValue=" "
            value={startDate}
            onChange={onStartDateChange}
          />
        </View>
        <View style={styles.rowItem}>
          <DatePickerInput
            label="Data Final"
            customValue=" "
            value={endDate}
            onChange={onEndDateChange}
          />
        </View>
      </View>

      <SelectInput
        label="Unidade de Medida"
        options={UNIT_OPTIONS}
        value={unit}
        onSelect={onUnitChange}
        placeholder="Selecione..."
      />

      <View style={styles.buttonArea}>
        <Button 
          title="Limpar" 
          variant="outline"
          isLoading={isLoading}
          style={styles.button} 
          onPress={onClear} 
        />
        <Button 
          title="Aplicar" 
          isLoading={isLoading}
          style={styles.button} 
          onPress={onApply} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card.subCard,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
  },
  title: {
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  rowItem: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  buttonArea: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: theme.spacing.sm,
    width: '47%',
  },
});