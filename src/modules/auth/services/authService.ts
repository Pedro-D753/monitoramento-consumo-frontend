import api from "@/config/api";
import { LoginFormData } from "../schemas/loginSchema";
import { SignUpData } from "../schemas/signUpSchema";

interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}
export const loginUser = async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/api/usuarios/login_usuario", data);
    return response.data;
};

interface RegisterResponse {
    id: number;
    real_name: string;
    username: string;
    email: string;
    created_at: string;
}

export const registerUser = async (data: SignUpData): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/api/Usuario/criar_usuario", data);
    return response.data;
}