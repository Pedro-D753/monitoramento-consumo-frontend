import api from './api';

export const login = (data) => api.post('/login_usuario', data);
export const register = (data) => api.post('/criar_usuario', data);

