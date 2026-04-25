import axios from 'axios';
import { storage } from './Storage';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, 
  timeout: 10000,
    headers: {
        'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
    },
});

// Interceptor de Requisição
api.interceptors.request.use(
  async (config) => {
    // Busca o token de forma assíncrona do SecureStore
    const token = await storage.getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta (Opcional, mas altamente recomendado)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Aqui você lidará com a expiração do token. 
      // O ideal é limpar o token e redirecionar para a tela de login.
      await storage.removeToken();
      // Nota: O redirecionamento pode ser gerido pelo contexto de autenticação 
      // ou disparando um evento global.
    }
    return Promise.reject(error);
  }
);