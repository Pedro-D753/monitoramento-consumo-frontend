import axios from 'axios';
import { storage } from './Storage';
import { router } from 'expo-router'

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
      if (router.canGoBack()) {
          router.dismissAll();
      }
      router.replace('/(auth)/sign-in');
    }
    return Promise.reject(error);
  }
);