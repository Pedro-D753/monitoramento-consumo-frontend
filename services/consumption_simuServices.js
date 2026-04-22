import api from './api';

export const create_simulation = (data) => api.post('/criar_simulacao', data);
export const list_simulation = (data) => api.get('/listar_consumos', data);
export const edit_simulation = (data) => api.post('/editar_simulacao', data);
export const delete_simulation = (data) => api.delete('/deletar_simulacao', data);