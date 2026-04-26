import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";
import { ENDPOINTS } from "./Endpoints";
import { storage } from "./Storage";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

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

let refreshPromise: Promise<string> | null = null;

async function clearSessionAndRedirect() {
  console.warn("⚠️ [AUTH] Limpando sessão e redirecionando para Login...");
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

// ============================================================================
// FUNÇÃO AUXILIAR: GERA O cURL PARA TESTAR NO POSTMAN/TERMINAL
// ============================================================================
const buildCurlCommand = (config: InternalAxiosRequestConfig) => {
  let curl = `curl -X ${config.method?.toUpperCase()} '${config.baseURL}${config.url}' \\\n`;
  
  if (config.headers) {
    for (const [key, value] of Object.entries(config.headers)) {
      if (typeof value === 'string' && key.toLowerCase() !== 'common' && key.toLowerCase() !== 'delete' && key.toLowerCase() !== 'get' && key.toLowerCase() !== 'head' && key.toLowerCase() !== 'post' && key.toLowerCase() !== 'put' && key.toLowerCase() !== 'patch') {
        curl += `  -H '${key}: ${value}' \\\n`;
      }
    }
  }

  if (config.data) {
    curl += `  -d '${JSON.stringify(config.data)}'`;
  } else {
    // Remove a última barra invertida se não houver body
    curl = curl.slice(0, -3); 
  }
  return curl;
};

// ============================================================================
// INTERCEPTOR DE REQUEST (IDA)
// ============================================================================
api.interceptors.request.use(
  async (config) => {
    const accessToken = await storage.getAccessToken();
    const refreshToken = await storage.getRefreshToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    console.log('\n🔵 ================== REQUEST ==================');
    console.log(`🚀 [MÉTODO/URL]  : ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log(`🔑 [STATE TOKENS]:`);
    console.log(`   ├─ Access  : ${accessToken || 'NULO/VÁZIO'}`);
    console.log(`   └─ Refresh : ${refreshToken || 'NULO/VÁZIO'}`);
    console.log(`📦 [PAYLOAD]     :`, config.data ? JSON.stringify(config.data, null, 2) : 'Vazio');
    console.log(`🌐 [CURL]        :\n${buildCurlCommand(config)}`);
    console.log('================================================\n');

    return config;
  },
  (error) => {
    console.error('🔴 [REQUEST SETUP ERROR]:', error);
    return Promise.reject(error);
  },
);

// ============================================================================
// LÓGICA DE REFRESH TOKEN (ISOLADA E LOGADA)
// ============================================================================
async function refreshAccessToken(): Promise<string> {
  console.log('🔄 [REFRESH] Iniciando processo de renovação de token...');
  const refreshToken = await storage.getRefreshToken();

  if (!refreshToken) {
    console.error('❌ [REFRESH] Falhou: Não há Refresh Token no storage local.');
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  console.log(`🔄 [REFRESH] Enviando Refresh Token: ${refreshToken}`);

  const response = await axios.post<{
    access_token?: string;
    refresh_token?: string;
  }>(
    `${process.env.EXPO_PUBLIC_API_URL}${ENDPOINTS.auth.refreshToken}`,
    { refresh_token: refreshToken },
    { headers: { "Content-Type": "application/json" } },
  );

  if (!response.data.access_token) {
    console.error('❌ [REFRESH] Falhou: API respondeu com 200, mas não enviou um access_token novo.');
    console.log('📄 [BODY DA RESPOSTA]:', response.data);
    throw new Error("A API não devolveu um novo access token.");
  }

  console.log('✅ [REFRESH] Sucesso! Novos tokens recebidos.');
  console.log(`   ├─ Novo Access  : ${response.data.access_token}`);
  console.log(`   └─ Novo Refresh : ${response.data.refresh_token ?? 'Mantendo o antigo'}`);

  await storage.saveTokens(
    response.data.access_token,
    response.data.refresh_token ?? refreshToken,
  );

  return response.data.access_token;
}

// ============================================================================
// INTERCEPTOR DE RESPONSE (VOLTA)
// ============================================================================
api.interceptors.response.use(
  (response) => {
    console.log('\n🟢 ================== RESPONSE =================');
    console.log(`✅ [STATUS/URL] : ${response.status} | ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log(`📄 [BODY]       :\n`, JSON.stringify(response.data, null, 2));
    console.log('================================================\n');
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    console.log('\n🔴 ================= ERROR RESPONSE ================');
    console.log(`❌ [STATUS/URL] : ${error.response?.status || 'NETWORK/TIMEOUT'} | ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`);
    console.log(`📄 [ERROR BODY] :\n`, JSON.stringify(error.response?.data || error.message, null, 2));
    console.log('================================================\n');

    if (!shouldRetryWithRefresh(originalRequest, error.response?.status)) {
      console.log('⛔ [INFO] Este erro não é elegível para Refresh (Não é 401 ou já foi tentado/rota ignorada).');
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
      } else {
        console.log('⏳ [REFRESH] Aguardando renovação em andamento por outra requisição...');
      }

      const newAccessToken = await refreshPromise;
      
      console.log(`🔁 [RETRY] Refazendo requisição original (${retryRequest.method?.toUpperCase()} ${retryRequest.url}) com novo token...`);
      retryRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(retryRequest);
    } catch (refreshError) {
      console.error('💥 [CRITICAL] Fluxo de Refresh falhou completamente. Deslogando usuário.');
      await clearSessionAndRedirect();
      return Promise.reject(refreshError);
    }
  },
);