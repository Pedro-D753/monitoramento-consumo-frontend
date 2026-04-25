import { api } from "@/config/Api";
import { LoginFormData } from "../schemas/LoginSchema";
import { SignUpData } from "../schemas/SignUpSchema";
import { ENDPOINTS } from "@/config/Endpoints";

// Interfaces baseadas no retorno do backend FastAPI
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserProfile {
  id: string | number;
  email: string;
  username: string;
  real_name: string;
}

interface RegisterResponse {
  id: number;
  real_name: string;
  username: string;
  email: string;
  created_at: string;
}

export const loginUser = async (
  data: LoginFormData,
): Promise<LoginResponse> => {
  const formData = `username=${encodeURIComponent(data.email)}&password=${encodeURIComponent(data.password)}`;

  const response = await api.post<LoginResponse>(
    ENDPOINTS.auth.login,
    formData,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
  );

  return response.data;
};

export const getUserInfo = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>(ENDPOINTS.auth.userInfo);
  return response.data;
};

export const registerUser = async (
  data: SignUpData,
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>(
    ENDPOINTS.auth.register, 
    data
  );
  return response.data;
};