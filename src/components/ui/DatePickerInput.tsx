/**
 * Input seletor de data com picker nativo.
 * Display formatted pt-BR.
 * Android auto-hide.
 */

import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { theme } from "@/config/Theme";

interface DatePickerInputProps {
  /** Label descritivo */
  label: string;
  /** Data selecionada */
  value: Date | undefined;
  /** Valor custom display */
  customValue?: string;
  /** Callback mudança data */
  onChange: (date: Date) => void;
  /** Mensagem erro */
  error?: string;
}

export function DatePickerInput({
  label,
  value,
  customValue,
  onChange,
  error,
}: DatePickerInputProps) {
  const [show, setShow] = useState(false);

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") setShow(false);

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const displayValue = value ? value.toLocaleDateString("pt-BR") : "";
  const isError = !!error;
  const borderColor = isError ? theme.colors.danger.main : theme.colors.border;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[styles.inputContainer, { borderColor }]}
        activeOpacity={0.7}
        onPress={() => setShow(true)}
      >
        <Text
          style={[
            styles.label,
            {
              color: value
                ? theme.colors.text.secondary
                : theme.colors.text.disabled,
            },
          ]}
        >
          {label}
        </Text>

        <View style={styles.valueRow}>
          <Text style={styles.valueText}>
            {displayValue || (customValue ? customValue : "Selecione uma data")}
          </Text>
          <Feather
            name="calendar"
            size={20}
            color={theme.colors.text.secondary}
          />
        </View>
      </TouchableOpacity>

      {isError && <Text style={styles.errorText}>{error}</Text>}

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
          themeVariant="dark"
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
    height: 55,
    paddingHorizontal: theme.spacing.md,
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    marginBottom: 2,
  },
  valueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
