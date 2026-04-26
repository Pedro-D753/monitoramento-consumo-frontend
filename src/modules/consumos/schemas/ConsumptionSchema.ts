// src/modules/consumos/schemas/ConsumptionSchema.ts
import { z } from "zod";

export interface ConsumptionRecord {
  id: number;
  starting_date: string;
  ending_date: string;
  measurement_unit: string;
  value: number;
  description?: string;
}

export interface ConsumptionFilters {
  measurement_unit?: string;
  starting_date?: string;
  ending_date?: string;
  minimum_value?: number;
  maximum_value?: number;
}

export interface ChartDataPoint {
  value: number;
  label: string;
  frontColor: string;
}

// Utilitário para evitar o erro de fuso horário (UTC offset)
const formatDateToApi = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const createConsumptionSchema = z.object({
  starting_date: z
    .date({ error: "A data de início é obrigatória" })
    .transform(formatDateToApi),
  ending_date: z
    .date({ error: "A data de fim é obrigatória" })
    .transform(formatDateToApi),
  si_measurement_unit: z.string().trim().min(1, "A unidade é obrigatória"),
  value: z
    .string()
    .trim()
    .min(1, "O valor é obrigatório")
    .transform((val: string) => Number(val.replace(",", ".")))
    .refine(
      (val: number) => !isNaN(val) && val > 0,
      "Valor deve ser maior que zero",
    ),
  description: z.string().optional(),
});

export type CreateConsumptionFormInput = z.input<
  typeof createConsumptionSchema
>;
export type CreateConsumptionFormOutput = z.output<
  typeof createConsumptionSchema
>;
