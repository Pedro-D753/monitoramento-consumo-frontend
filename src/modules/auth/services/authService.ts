import api from "@/config/api";
import { LoginFormData } from "../schemas/loginSchema";
import { AxiosError } from "axios";

interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}
export const loginUser = async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/api/usuarios/login_usuario", data);
    return response.data;
};