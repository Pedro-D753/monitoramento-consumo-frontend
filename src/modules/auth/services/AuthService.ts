import { api } from "@/config/Api";
import { LoginFormData } from "../schemas/LoginSchema";
import { SignUpData } from "../schemas/SignUpSchema";
import { ENDPOINTS } from "@/config/Endpoints";
import { storage } from "@/config/Storage";

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export const loginUser = async (
  data: LoginFormData,
): Promise<LoginResponse> => {

  const formData = `username=${encodeURIComponent(data.email)}&password=${encodeURIComponent(data.password)}`

  const response = await api.post<LoginResponse>(
    ENDPOINTS.auth.login,
    formData,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
  );

  const token = response.data.access_token;

  return response.data;
};

interface RegisterResponse {
  id: number;
  real_name: string;
  username: string;
  email: string;
  created_at: string;
}

export const registerUser = async (
  data: SignUpData,
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>(
    ENDPOINTS.auth.register, data
  );
  return response.data;
};
