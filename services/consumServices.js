import api from './api';

export const create_consumption = (data) => api.post('/criar_consumo', data);
export const list_consumption = (data) => api.get('/listar_consumos', data);
export const edit_consumption = (data) => api.post('/editar_consumo', data);
export const delete_consumption = (data) => api.delete('/deletar_consumo', data);