import axios, { AxiosInstance } from 'axios';

// Criando uma instância do Axios com a URL base da API

const api: AxiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL, // Substitua pela URL real da sua API
    timeout: 15000, // Tempo limite para requisições (5 segundos)
    headers: {
        'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
    },
})

export default api;