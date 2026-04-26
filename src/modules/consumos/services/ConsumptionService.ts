import { api } from "@/config/Api";
import { ENDPOINTS } from "@/config/Endpoints";
import {
  ConsumptionRecord,
  ConsumptionFilters,
  CreateConsumptionPayload,
} from "../schemas/ConsumptionSchema";

export type EntryType = "real" | "simulation" | "goal";

const ENDPOINT_MAP: Record<EntryType, string> = {
  real: ENDPOINTS.consumos.criar,
  simulation: ENDPOINTS.simulacoes.criar,
  goal: ENDPOINTS.metas.criar,
};

export const getConsumos = async (
  filters?: ConsumptionFilters,
): Promise<ConsumptionRecord[]> => {
  const response = await api.get<ConsumptionRecord[]>(
    ENDPOINTS.consumos.listar,
    { params: filters },
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
