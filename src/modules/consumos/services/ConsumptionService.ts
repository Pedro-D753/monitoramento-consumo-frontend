import { api } from "@/config/Api";
import { ENDPOINTS } from "@/config/Endpoints";
import {
  ConsumptionRecord,
  ConsumptionFilters,
  CreateConsumptionPayload,
} from "../schemas/ConsumptionSchema";

export interface EditConsumptionPayload {
  new_starting_date?: string;
  new_ending_date?: string;
  new_si_measurement_unit?: string;
  new_value?: number;
}

export type EntryType = "real" | "simulation" | "goal";

const ENDPOINT_MAP: Record<EntryType, string> = {
  real: ENDPOINTS.consumos.criar,
  simulation: ENDPOINTS.simulacoes.criar,
  goal: ENDPOINTS.metas.criar,
};

const EDIT_ENDPOINT_MAP: Record<EntryType, (id: number) => string> = {
  real: ENDPOINTS.consumos.editar,
  simulation: ENDPOINTS.simulacoes.editar,
  goal: ENDPOINTS.metas.editar,
};

const DELETE_ENDPOINT_MAP: Record<EntryType, (id: number) => string> = {
  real: ENDPOINTS.consumos.deletar,
  simulation: ENDPOINTS.simulacoes.deletar,
  goal: ENDPOINTS.metas.deletar,
};

export const editConsumo = async (
  type: EntryType,
  id: number,
  data: EditConsumptionPayload,
): Promise<ConsumptionRecord> => {
  const response = await api.patch<ConsumptionRecord>(
    EDIT_ENDPOINT_MAP[type](id),
    data,
  );
  return response.data;
};

export const deleteConsumo = async (
  type: EntryType,
  id: number,
): Promise<void> => {
  await api.delete(DELETE_ENDPOINT_MAP[type](id));
};

export const getConsumos = async (
  filters?: ConsumptionFilters,
): Promise<ConsumptionRecord[]> => {
  const response = await api.get<ConsumptionRecord[]>(
    ENDPOINTS.consumos.listar,
  );
  return response.data;
};

export const createConsumo = async (
  type: EntryType,
  data: CreateConsumptionPayload,
): Promise<ConsumptionRecord> => {
  const response = await api.post<ConsumptionRecord>(
    ENDPOINT_MAP[type],
    data,
  );
  return response.data;
};
