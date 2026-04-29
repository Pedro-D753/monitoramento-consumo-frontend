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
  real:       ENDPOINTS.consumos.criar,
  simulation: ENDPOINTS.simulacoes.criar,
  goal:       ENDPOINTS.metas.criar,
};

const EDIT_ENDPOINT_MAP: Record<EntryType, (id: number) => string> = {
  real:       ENDPOINTS.consumos.editar,
  simulation: ENDPOINTS.simulacoes.editar,
  goal:       ENDPOINTS.metas.editar,
};

const DELETE_ENDPOINT_MAP: Record<EntryType, (id: number) => string> = {
  real:       ENDPOINTS.consumos.deletar,
  simulation: ENDPOINTS.simulacoes.deletar,
  goal:       ENDPOINTS.metas.deletar,
};

const LIST_ENDPOINT_MAP: Record<EntryType, string> = {
  real:       ENDPOINTS.consumos.listar,
  simulation: ENDPOINTS.simulacoes.listar,
  goal:       ENDPOINTS.metas.listar,
};

export const editConsumo = async (
  type: EntryType,
  id: number,
  data: EditConsumptionPayload,
): Promise<ConsumptionRecord> => {
  const response = await api.patch<ConsumptionRecord>(EDIT_ENDPOINT_MAP[type](id), data);
  return response.data;
};

export const deleteConsumo = async (type: EntryType, id: number): Promise<void> => {
  await api.delete(DELETE_ENDPOINT_MAP[type](id));
};

export const getConsumos = async (
  type: EntryType = "real",
  filters: ConsumptionFilters = {},
): Promise<ConsumptionRecord[]> => {
  const response = await api.post<ConsumptionRecord[]>(LIST_ENDPOINT_MAP[type], filters);
  return response.data;
};

export const createConsumo = async (
  type: EntryType,
  data: CreateConsumptionPayload,
): Promise<ConsumptionRecord> => {
  // ✅ Bug #7: description é armazenada localmente — nunca enviada para a API
  // Evita 422 se o backend tiver extra='forbid' no schema Pydantic
  const { description: _localOnly, ...apiPayload } =
    data as CreateConsumptionPayload & { description?: string };

  const response = await api.post<ConsumptionRecord>(ENDPOINT_MAP[type], apiPayload);
  return response.data;
};