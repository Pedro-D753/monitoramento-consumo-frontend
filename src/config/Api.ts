import axios from 'axios';
import { storage } from './Storage';
import { router } from 'expo-router';
import { ENDPOINTS } from './Endpoints';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Requisição (Injeta o Token)
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getAccessToken(); // Atualizado para usar a nova nomenclatura
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Flag para evitar loops infinitos caso o backend continue retornando 401
let isRefreshing = false;

// Interceptor de Resposta (Lida com o Token Expirado)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 e ainda não tentamos dar retry nesta requisição específica
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await storage.getRefreshToken();
        
        if (!refreshToken) {
            // Em vez de quebrar o app com throw, limpamos os dados e deslogamos
            console.warn("Refresh token ausente. Forçando logout.");
            await storage.removeTokens();
            if (router.canGoBack()) {
                router.dismissAll();
            }
            router.replace('/(auth)/sign-in');
            return Promise.reject(new Error("Sessão expirada. Faça login novamente."));
        }

        // Importante: Usamos o axios global aqui, e não a instância 'api',
        // para não cairmos no interceptor novamente e criarmos um loop infinito.
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}${ENDPOINTS.auth.refreshToken}`,
          { refresh_token: refreshToken }, 
          // NOTA: Se o seu FastAPI exige Form-UrlEncoded para o refresh, adapte isso igual fizemos no login!
          { headers: { 'Content-Type': 'application/json' } }
        );

        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token || refreshToken; // Se a API não devolver um novo refresh, mantém o atual

        // Salva os novos tokens no SecureStore
        await storage.saveTokens(newAccessToken, newRefreshToken);

        // Atualiza o header da requisição original que havia falhado e a refaz
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Se o refresh token também for inválido ou estiver expirado, mata a sessão
        await storage.removeTokens();
        if (router.canGoBack()) {
            router.dismissAll();
        }
        router.replace('/(auth)/sign-in');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);