import axios from 'axios';

const API_URL = 'http://localhost:8000/vertedero/vertedero/';

// Crear una instancia de Axios con configuración base
const api = axios.create({
  baseURL: API_URL,
});

// Función para obtener encabezados reutilizables
const getHeaders = () => ({
  'Authorization': `Token ${localStorage.getItem('token')}`,
  'Accept': '*/*',
  'Content-Type': 'application/json',
});

// Obtener todos los registros de vertedero
export const getVertederoRecords = async () => {
  try {
    const response = await api.get('', { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching vertedero records:', error);
    throw error;
  }
};

// Crear un nuevo registro en vertedero
export const createVertederoRecord = async (data: { date: string; weight_kg: number; value: number }) => {
  try {
    console.log('Creating vertedero record with data:', data);
    const response = await api.post('', data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error creating vertedero record:', error);
    throw error;
  }
};

// Eliminar un registro de vertedero
export const deleteVertederoRecord = async (id: number) => {
  try {
    const response = await api.delete(`${id}/`, { headers: getHeaders() });
    console.log('Deleted vertedero record:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting vertedero record:', error);
    throw error;
  }
};

// Actualizar un registro de vertedero
export const updateVertederoRecord = async (id: number, data: { date: string; weight_kg: number; value: number }) => {
  try {
    console.log('Updating vertedero record with data:', data);
    const response = await api.put(`${id}/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error updating vertedero record:', error);
    throw error;
  }
};

// Obtener totales de peso y valor
export const getVertederoTotals = async () => {
  try {
    const response = await api.get('totals/', { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching vertedero totals:', error);
    throw error;
  }
};
