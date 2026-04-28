import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { storage } from "@/config/Storage";
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
  createConsumptionSchema,
  CreateConsumptionFormInput,
  CreateConsumptionFormOutput,
} from "../schemas/ConsumptionSchema";
import { createConsumo, EntryType } from "../services/ConsumptionService";

interface Props {
  type?: EntryType;
  onSuccess: () => void;
}

const UNIT_OPTIONS = [
  { label: "Energia (kWh)", value: "kWh" },
  { label: "Água (L)", value: "L" },
  { label: "Gás (m³)", value: "m³" },
  { label: "Dinheiro (R$)", value: "R$" },
  { label: "Outros...", value: "custom" },
];

export function CreateConsumptionForm({ type = "real", onSuccess }: Props) {
  const [isCustomUnit, setIsCustomUnit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateConsumptionFormInput, any, CreateConsumptionFormOutput>({
    resolver: zodResolver(createConsumptionSchema),
    defaultValues: { si_measurement_unit: "", value: "" },
  });

  const onSubmit = async (data: CreateConsumptionFormOutput) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await createConsumo(type, data);

      //TODO - integração com o DB para fazer isso no futuro
      if (data.description) {
        await storage.saveDescription(response.id, data.description);
      }
      
      onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        setErrorMsg(
          Array.isArray(detail)
            ? detail[0]?.msg || "Não foi possível salvar o registro."
            : detail || "Não foi possível salvar o registro.",
        );
      } else {
        setErrorMsg("Não foi possível salvar o registro.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <Input
            label="Identificador (Opcional)"
            placeholder="Ex: Conta de casa, Chuveiro..."
            value={field.value}
            onChangeText={field.onChange}
            error={errors.description?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="si_measurement_unit"
        render={({ field }) => (
          <View>
            <SelectInput
              label="Unidade"
              options={UNIT_OPTIONS}
              value={isCustomUnit ? "custom" : field.value}
              onSelect={(val) => {
                if (val === "custom") {
                  setIsCustomUnit(true);
                  setValue("si_measurement_unit", "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                } else {
                  setIsCustomUnit(false);
                  setValue("si_measurement_unit", val, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }
              }}
              error={
                !isCustomUnit ? errors.si_measurement_unit?.message : undefined
              }
            />
            {isCustomUnit && (
              <Input
                label="Unidade Customizada"
                value={field.value}
                onChangeText={field.onChange}
                autoFocus
                error={errors.si_measurement_unit?.message}
              />
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="value"
        render={({ field }) => (
          <Input
            label="Valor/Volume"
            keyboardType="numeric"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.value?.message}
          />
        )}
      />

      <View style={styles.row}>
        <View style={styles.flexItem}>
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
        <View style={styles.flexItem}>
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
        title="Confirmar"
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
        style={styles.submitButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: theme.spacing.md,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  flexItem: {
    flex: 1,
  },
  submitButton: {
    width: "100%",
    marginTop: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.danger.main,
    textAlign: "center",
    marginVertical: theme.spacing.sm,
  },
});
