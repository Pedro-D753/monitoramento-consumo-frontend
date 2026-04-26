import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/config/Theme';

interface DatePickerInputProps {
  label: string;
  value: Date | undefined;
  onChange: (date: Date) => void;
  customValue?: string,
  error?: string;
}

export function DatePickerInput({ label, value, onChange, error, customValue }: DatePickerInputProps) {
  const [show, setShow] = useState(false);

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // No Android, ao selecionar a data, o calendário já fecha
    if (Platform.OS === 'android') setShow(false);
    
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  // Formata a data para exibir na UI (ex: 24/04/2026)
  const displayValue = value ? value.toLocaleDateString('pt-BR') : '';
  const isError = !!error;
  const borderColor = isError ? theme.colors.danger.main : theme.colors.border;

  return (
    <View style={styles.wrapper}>
      {/* Usamos um TouchableOpacity para imitar um Input */}
      <TouchableOpacity 
        style={[styles.inputContainer, { borderColor }]} 
        activeOpacity={0.7}
        onPress={() => setShow(true)}
      >
        <Text style={[styles.label, { color: value ? theme.colors.text.secondary : theme.colors.text.disabled }]}>
          {label}
        </Text>
        
        <View style={styles.valueRow}>
          <Text style={styles.valueText}>
            {displayValue ||  displayValue ? displayValue : (
              customValue ? customValue : 'Selecione uma data' 
            )}
          </Text>
          <Feather name="calendar" size={20} color={theme.colors.text.secondary} />
        </View>
      </TouchableOpacity>

      {isError && <Text style={styles.errorText}>{error}</Text>}

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
          themeVariant="dark" // Força o visual dark para combinar com o Liqua
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: theme.spacing.md,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.input,
    height: 55, // Um pouco mais alto para acomodar a Label interna fixa
    paddingHorizontal: theme.spacing.md,
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    marginBottom: 2,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueText: {
    color: theme.colors.text.neutral,
    fontSize: 16,
  },
  errorText: {
    color: theme.colors.danger.main,
    fontSize: 12,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
});