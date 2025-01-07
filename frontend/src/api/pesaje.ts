// import { PesajeProps } from '@/pages/Pesaje/components/form/schema';
// import axios from 'axios';

// const BASE_URL = 'http://localhost:8000/pesajes';

// // Axios instance
// const api = axios.create({
//   baseURL: BASE_URL,
// });

// // CRUD operations for Certificados
// export const certificadosAPI = {
//   getAll: async () => {
//     const response = await api.get('/certificados/');
//     return response.data;
//   },
//   getById: async (id: number) => {
//     const response = await api.get(`/certificados/${id}/`);
//     return response.data;
//   },
//   create: async (data: PesajeProps) => {
//     const response = await api.post('/certificados/', data);
//     return response.data;
//   },
//   update: async (id: number, data:PesajeProps) => {
//     const response = await api.put(`/certificados/${id}/`, data);
//     return response.data;
//   },
//   delete: async (id: number) => {
//     const response = await api.delete(`/certificados/${id}/`);
//     return response.data;
//   },
// };

// // CRUD operations for Vehiculos
// export const vehiculosAPI = {
//   getAll: async () => {
//     const response = await api.get('/vehiculos/');
//     return response.data;
//   },
//   getById: async (id: number) => {
//     const response = await api.get(`/vehiculos/${id}/`);
//     return response.data;
//   },
//   create: async (data: {
//     patente: string;
//     tipo_camion: string;
//     conductor_id: number;
//   }) => {
//     const response = await api.post('/vehiculos/', data);
//     return response.data;
//   },
//   update: async (id: number, data: {
//     patente?: string;
//     tipo_camion?: string;
//     conductor_id?: number;
//   }) => {
//     const response = await api.put(`/vehiculos/${id}/`, data);
//     return response.data;
//   },
//   delete: async (id: number) => {
//     const response = await api.delete(`/vehiculos/${id}/`);
//     return response.data;
//   },
// };

// // CRUD operations for Conductores
// export const conductoresAPI = {
//   getAll: async () => {
//     const response = await api.get('/conductores/');
//     return response.data;
//   },
//   getById: async (id: number) => {
//     const response = await api.get(`/conductores/${id}/`);
//     return response.data;
//   },
//   create: async (data: {
//     nombre: string;
//     rut: string;
//   }) => {
//     const response = await api.post('/conductores/', data);
//     return response.data;
//   },
//   update: async (id: number, data: {
//     nombre?: string;
//     rut?: string;
//   }) => {
//     const response = await api.put(`/conductores/${id}/`, data);
//     return response.data;
//   },
//   delete: async (id: number) => {
//     const response = await api.delete(`/conductores/${id}/`);
//     return response.data;
//   },
// };

import { PesajeProps } from '@/pages/Pesaje/components/form/schema';
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/pesajes';

// Crear una instancia de Axios con configuración base
const api = axios.create({
  baseURL: BASE_URL,
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
    const response = await api.get('/certificados/', {
      headers: getHeaders(),
    });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/certificados/${id}/`, {
      headers: getHeaders(),
    });
    return response.data;
  },
  create: async (data: PesajeProps) => {
    const response = await api.post('/certificados/', data, {
      headers: getHeaders(),
    });
    return response.data;
  },
  update: async (id: number, data: PesajeProps) => {
    const response = await api.put(`/certificados/${id}/`, data, {
      headers: getHeaders(),
    });
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/certificados/${id}/`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};

// CRUD operations for Vehiculos
export const vehiculosAPI = {
  getAll: async () => {
    const response = await api.get('/vehiculos/', {
      headers: getHeaders(),
    });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/vehiculos/${id}/`, {
      headers: getHeaders(),
    });
    return response.data;
  },
  create: async (data: {
    patente: string;
    tipo_camion: string;
    conductor_id: number;
  }) => {
    const response = await api.post('/vehiculos/', data, {
      headers: getHeaders(),
    });
    return response.data;
  },
  update: async (id: number, data: {
    patente?: string;
    tipo_camion?: string;
    conductor_id?: number;
  }) => {
    const response = await api.put(`/vehiculos/${id}/`, data, {
      headers: getHeaders(),
    });
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/vehiculos/${id}/`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};

// CRUD operations for Conductores
export const conductoresAPI = {
  getAll: async () => {
    const response = await api.get('/conductores/', {
      headers: getHeaders(),
    });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/conductores/${id}/`, {
      headers: getHeaders(),
    });
    return response.data;
  },
  create: async (data: {
    nombre: string;
    rut: string;
  }) => {
    const response = await api.post('/conductores/', data, {
      headers: getHeaders(),
    });
    return response.data;
  },
  update: async (id: number, data: {
    nombre?: string;
    rut?: string;
  }) => {
    const response = await api.put(`/conductores/${id}/`, data, {
      headers: getHeaders(),
    });
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/conductores/${id}/`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
