import axios from 'axios';
import { Cotizacion } from '@/types/cotizacion'; // Ajusta la ruta al tipo que uses
import { cotizacionFormProps } from '@/pages/Cotizacion/components/schema';
import { API_URL } from '.';

// const API_URL = 'http://localhost:8000/cotizaciones/';
// Función para obtener encabezados reutilizables
const getHeaders = () => ({
  'Authorization': `Token ${localStorage.getItem('token')}`,
  'Accept': '*/*',
  'Content-Type': 'application/json',
});

// Obtener una lista de cotizaciones con paginación y filtro
export const getCotizaciones = async () => {
  try {
    const response = await axios.get(`${API_URL}cotizaciones/cotizaciones/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching cotizaciones:', error);
    throw error;
  }
};

// Obtener una cotización específica por su ID
export const getCotizacionById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}cotizaciones/cotizaciones/${id}/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching cotizacion by ID:', error);
    throw error;
  }
};

// Crear una nueva cotización
export const createCotizacion = async (data: cotizacionFormProps) => {
  try {
    const response = await axios.post(`${API_URL}cotizaciones/cotizaciones/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error creating cotizacion:', error);
    throw error;
  }
};

// Actualizar una cotización existente
export const updateCotizacion = async (id: number, data: Cotizacion) => {
  try {
    const response = await axios.put(`${API_URL}cotizaciones/cotizaciones/${id}/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error updating cotizacion:', error);
    throw error;
  }
};

// Eliminar una cotización
export const deleteCotizacion = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}cotizaciones/cotizaciones/${id}/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error deleting cotizacion:', error);
    throw error;
  }
};

// Filtrar cotizaciones por cliente
export const getCotizacionesByClient = async (
  clientId: number,
  page: number = 1,
  pageSize: number = 10
) => {
  try {
    const response = await axios.get(
      `${API_URL}cotizaciones/cotizaciones/?client_id=${clientId}&page=${page}&page_size=${pageSize}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching cotizaciones by client:', error);
    throw error;
  }
};
