import axios from 'axios';

const api = axios.create({
    baseURL: 'https://liquamonitor.dev'
});

export default api;