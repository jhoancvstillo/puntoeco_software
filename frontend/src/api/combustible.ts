
import axios from 'axios';
import { CombustibleSinTotal } from '@/types/combustible'; // Ajusta la ruta al tipo que uses
import { API_URL } from '.';

// Obtener una lista de combustibles
export const getCombustibles = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  try {
    const response = await axios.get(`${API_URL}combustible/combustible/`, {
      headers: {
        Authorization: `Token ${token}`,
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
      
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching combustibles:', error);
    throw error;
  }
};

// Obtener un combustible específico por su ID
export const getCombustibleById = async (id: number) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  try {
    const response = await axios.get(`${API_URL}combustible/combustible${id}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching combustible by ID:', error);
    throw error;
  }
};

// Crear un nuevo combustible
export const createCombustible = async (data: CombustibleSinTotal) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  try {
    const response = await axios.post(`${API_URL}combustible/combustible/`, data, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating combustible:', error);
    throw error;
  }
};

// Eliminar un combustible con la id
export const deleteCombustible = async (id: number) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  try {
    const response = await axios.delete(`${API_URL}combustible/combustible/${id}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting combustible:', error);
    throw error;
  }
};
