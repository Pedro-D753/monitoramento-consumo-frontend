import { api } from "@/config/Api";
import { ENDPOINTS } from "@/config/Endpoints";

export interface Tip {
  si_measurement_unit: string;
  tip: string;
}

export const getTip = async (unit: string): Promise<Tip> => {
  const response = await api.get<Tip>(ENDPOINTS.dicas.aleatoria(unit));
  return response.data;
};