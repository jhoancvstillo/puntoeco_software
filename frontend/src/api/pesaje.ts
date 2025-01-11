
import { PesajeProps } from '@/pages/Pesaje/components/form/schema';
import axios from 'axios';
import { API_URL } from '.';

// const BASE_URL = 'http://localhost:8000/pesajes';

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

// CRUD operations for Certificados
export const certificadosAPI = {
  getAll: async () => {
    const response = await api.get('pesajes/certificados/', {
      headers: getHeaders(),
    });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`pesajes/certificados/${id}/`, {
      headers: getHeaders(),
    });
    return response.data;
  },
  create: async (data: PesajeProps) => {
    const response = await api.post('pesajes/certificados/', data, {
      headers: getHeaders(),
    });
    return response.data;
  },
  update: async (id: number, data: PesajeProps) => {
    const response = await api.put(`pesajes/certificados/${id}/`, data, {
      headers: getHeaders(),
    });
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`pesajes/certificados/${id}/`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};

// CRUD operations for Vehiculos
export const vehiculosAPI = {
  getAll: async () => {
    const response = await api.get('pesajes/vehiculos/', {
      headers: getHeaders(),
    });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`pesajes/vehiculos/${id}/`, {
      headers: getHeaders(),
    });
    return response.data;
  },
  create: async (data: {
    patente: string;
    tipo_camion: string;
    conductor_id: number;
  }) => {
    const response = await api.post('pesajes/vehiculos/', data, {
      headers: getHeaders(),
    });
    return response.data;
  },
  update: async (id: number, data: {
    patente?: string;
    tipo_camion?: string;
    conductor_id?: number;
  }) => {
    const response = await api.put(`pesajes/vehiculos/${id}/`, data, {
      headers: getHeaders(),
    });
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`pesajes/vehiculos/${id}/`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};

// CRUD operations for Conductores
export const conductoresAPI = {
  getAll: async () => {
    const response = await api.get('pesajes/conductores/', {
      headers: getHeaders(),
    });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`pesajes/conductores/${id}/`, {
      headers: getHeaders(),
    });
    return response.data;
  },
  create: async (data: {
    nombre: string;
    rut: string;
  }) => {
    const response = await api.post('pesajes/conductores/', data, {
      headers: getHeaders(),
    });
    return response.data;
  },
  update: async (id: number, data: {
    nombre?: string;
    rut?: string;
  }) => {
    const response = await api.put(`pesajes/conductores/${id}/`, data, {
      headers: getHeaders(),
    });
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`pesajes/conductores/${id}/`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
