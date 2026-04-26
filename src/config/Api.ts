import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";
import { ENDPOINTS } from "./Endpoints";
import { storage } from "./Storage";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

// Essas rotas não devem disparar refresh automático em caso de 401.
const NON_REFRESH_RETRY_PATHS = [
  ENDPOINTS.auth.login,
  ENDPOINTS.auth.register,
  ENDPOINTS.auth.logout,  
  ENDPOINTS.auth.refreshToken,
  ENDPOINTS.auth.forgotPassword,
  ENDPOINTS.auth.resetPassword,
];

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Requests que falham juntos compartilham o mesmo refresh para evitar corrida.
let refreshPromise: Promise<string> | null = null;

async function clearSessionAndRedirect() {
  await storage.removeTokens();

  if (router.canGoBack()) {
    router.dismissAll();
  }

  router.replace("/(auth)/sign-in");
}

function shouldRetryWithRefresh(
  request: RetryableRequestConfig | undefined,
  status: number | undefined,
) {
  if (status !== 401 || !request || request._retry) {
    return false;
  }

  const requestUrl = request.url ?? "";
  return !NON_REFRESH_RETRY_PATHS.some((path) => requestUrl.includes(path));
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await storage.getRefreshToken();

  if (!refreshToken) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  const response = await axios.post<{
    access_token?: string;
    refresh_token?: string;
  }>(
    `${process.env.EXPO_PUBLIC_API_URL}${ENDPOINTS.auth.refreshToken}`,
    { refresh_token: refreshToken },
    { headers: { "Content-Type": "application/json" } },
  );

  if (!response.data.access_token) {
    throw new Error("A API não devolveu um novo access token.");
  }

  await storage.saveTokens(
    response.data.access_token,
    response.data.refresh_token ?? refreshToken,
  );

  return response.data.access_token;
}

api.interceptors.request.use(
  async (config) => {
    const token = await storage.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!shouldRetryWithRefresh(originalRequest, error.response?.status)) {
      return Promise.reject(error);
    }

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const retryRequest = originalRequest;
    retryRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;
      retryRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(retryRequest);
    } catch (refreshError) {
      await clearSessionAndRedirect();
      return Promise.reject(refreshError);
    }
  },
);
