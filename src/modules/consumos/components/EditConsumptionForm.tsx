import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { DatePickerInput } from "@/components/ui/DatePickerInput";
import { SelectInput } from "@/components/ui/SelectInput";
import { theme } from "@/config/Theme";
import {
  editConsumptionSchema,
  EditConsumptionFormData,
  ConsumptionRecord,
  parseApiDate,
  formatDateToApi,
} from "../schemas/ConsumptionSchema";
import { editConsumo, EntryType } from "../services/ConsumptionService";

interface Props {
  type: EntryType;
  record: ConsumptionRecord;
  onSuccess: () => void;
  onCancel: () => void;
}

const UNIT_OPTIONS = [
  { label: "Energia (kWh)", value: "kWh" },
  { label: "Água (L)", value: "L" },
  { label: "Gás (m³)", value: "m³" },
  { label: "Dinheiro (R$)", value: "R$" },
  { label: "Outros...", value: "custom" },
];

export function EditConsumptionForm({ type, record, onSuccess, onCancel }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<EditConsumptionFormData>({
    resolver: zodResolver(editConsumptionSchema),
    defaultValues: {
      starting_date: parseApiDate(record.starting_date),
      ending_date: parseApiDate(record.ending_date),
      si_measurement_unit: record.si_measurement_unit,
      value: String(record.value),
    },
  });

  const onSubmit = async (data: EditConsumptionFormData) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // Transform manual aqui, fora do schema
      const payload = {
        ...(data.starting_date && { new_starting_date: formatDateToApi(data.starting_date) }),
        ...(data.ending_date && { new_ending_date: formatDateToApi(data.ending_date) }),
        ...(data.si_measurement_unit && { new_si_measurement_unit: data.si_measurement_unit }),
        ...(data.value && { new_value: Number(data.value.replace(",", ".")) }),
      };
      await editConsumo(type, record.id, payload);
      onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        setErrorMsg(
          typeof detail === "string" ? detail : "Erro ao atualizar."
        );
      } else {
        setErrorMsg("Erro ao atualizar.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="si_measurement_unit"
        render={({ field }) => (
          <SelectInput
            label="Unidade"
            options={UNIT_OPTIONS}
            value={field.value ?? ""}
            onSelect={field.onChange}
            error={errors.si_measurement_unit?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="value"
        render={({ field }) => (
          <Input
            label="Valor"
            keyboardType="numeric"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.value?.message}
          />
        )}
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: theme.spacing.sm }}>
          <Controller
            control={control}
            name="starting_date"
            render={({ field }) => (
              <DatePickerInput
                label="Data Inicial"
                customValue=" "
                value={field.value}
                onChange={field.onChange}
                error={errors.starting_date?.message}
              />
            )}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Controller
            control={control}
            name="ending_date"
            render={({ field }) => (
              <DatePickerInput
                label="Data Final"
                customValue=" "
                value={field.value}
                onChange={field.onChange}
                error={errors.ending_date?.message}
              />
            )}
          />
        </View>
      </View>

      {errorMsg && (
        <Typography variant="regular" size="sm" style={styles.errorText}>
          {errorMsg}
        </Typography>
      )}

      <Button
        title="Salvar Alterações"
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
        style={styles.btn}
      />
      <Button
        title="Cancelar"
        variant="outline"
        onPress={onCancel}
        style={styles.btn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", paddingVertical: theme.spacing.sm },
  row: { flexDirection: "row" },
  errorText: {
    color: theme.colors.danger.main,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  btn: { width: "100%", marginTop: theme.spacing.sm },
});