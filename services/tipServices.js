import api from './api';

export const get_tip = (data) => api.get('/pegar_dica_aleatoria', data);