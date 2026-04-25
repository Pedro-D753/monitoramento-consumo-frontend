import api from "@/config/Api";
import { LoginFormData } from "../schemas/LoginSchema";
import { SignUpData } from "../schemas/SignUpSchema";
import { ENDPOINTS } from "@/config/Endpoints";

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export const loginUser = async (
  data: LoginFormData,
): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append("username", data.email); // OAuth2 exige 'username', mas recebe o email
  formData.append("password", data.password);

  const response = await api.post<LoginResponse>(
    ENDPOINTS.auth.login,
    formData,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
  );
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
    "/api/Usuario/criar_usuario",
    data,
  );
  return response.data;
};
