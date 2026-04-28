import { z } from "zod";

export interface ConsumptionRecord {
  id: number;
  starting_date: string;
  ending_date: string;
  si_measurement_unit: string;
  value: number;
  description?: string;
}

export interface ConsumptionFilters {
  si_measurement_unit?: string; 
  starting_date?: string;
  ending_date?: string;
  minimum_value?: number;
  maximum_value?: number;
}

export interface ChartDataPoint {
  value: number;
  label: string;
  frontColor?: string; // opcional: BarChart usa, LineChart ignora
  dataPointColor?: string; // opcional: LineChart usa para colorir pontos individuais
}

// Mantém datas no calendário local para não deslocar o dia por UTC.
export const formatDateToApi = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseApiDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Importações omitidas (certifique-se de manter o import do 'z' e da função 'formatDateToApi')

export const createConsumptionSchema = z
  .object({
    description: z
    .string()
    .trim()
    .optional(),
    starting_date: z
      .date()
      .refine((d) => d instanceof Date && !isNaN(d.getTime()), {
        message: "A data de início é obrigatória",
      })
      .transform(formatDateToApi),
      
    ending_date: z
      .date()
      .refine((d) => d instanceof Date && !isNaN(d.getTime()), {
        message: "A data de fim é obrigatória",
      })
      .transform(formatDateToApi),
      
    si_measurement_unit: z
      .string()
      .trim()
      .min(1, { message: "A unidade é obrigatória" }),
      
    value: z
      .string()
      .trim()
      .min(1, { message: "O valor é obrigatório" })
      .transform((val: string) => Number(val.replace(",", ".")))
      .refine((val: number) => !isNaN(val) && val > 0, {
        message: "Valor deve ser maior que zero",
      })
      // ✅ NOVA TRAVA FÍSICA: Máximo de 5 dígitos inteiros
      .refine((val: number) => val <= 99999, {
        message: "O valor máximo permitido é 99.999",
      }),
  })
  .refine((data) => data.ending_date >= data.starting_date, {
    path: ["ending_date"],
    message: "A data final deve ser igual ou posterior à inicial.",
  });

export const editConsumptionSchema = z.object({
  description: z
  .string()
  .trim()
  .optional(),
  starting_date: z
    .date()
    .refine((d) => d instanceof Date && !isNaN(d.getTime()), {
      message: "Data de início inválida",
    })
    .optional(),
    
  ending_date: z
    .date()
    .refine((d) => d instanceof Date && !isNaN(d.getTime()), {
      message: "Data de fim inválida",
    })
    .optional(),
    
  si_measurement_unit: z
    .string()
    .trim()
    .min(1, { message: "Unidade obrigatória" })
    .optional(),
    
  value: z
    .string()
    .trim()
    .optional()
    // 1. Valida se é um número válido e maior que zero
    .refine(
      (val) => {
        if (!val) return true; // Se estiver vazio, passa (pois é opcional)
        const num = Number(val.replace(",", "."));
        return !isNaN(num) && num > 0;
      },
      { message: "Deve ser maior que zero" }
    )
    // 2. ✅ NOVA TRAVA FÍSICA: Converte internamente para checar o teto de 99.999
    .refine(
      (val) => {
        if (!val) return true; 
        const num = Number(val.replace(",", "."));
        return num <= 99999;
      },
      { message: "O valor máximo permitido é 99.999" }
    ),
});

export type EditConsumptionFormData = z.infer<typeof editConsumptionSchema>;
export type EditConsumptionFormInput = z.input<typeof editConsumptionSchema>;
export type EditConsumptionFormOutput = z.output<typeof editConsumptionSchema>;

export type CreateConsumptionFormInput = z.input<
  typeof createConsumptionSchema
>;
export type CreateConsumptionFormOutput = z.output<
  typeof createConsumptionSchema
>;
export type CreateConsumptionPayload = CreateConsumptionFormOutput;
