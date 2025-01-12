// clients.ts
import axios from 'axios';
import { Cliente } from '@/types/client'; // Ajusta la ruta al tipo que uses
import { API_URL } from '.';

// Función para obtener encabezados reutilizables
const getHeaders = () => ({
  'Authorization': `Token ${localStorage.getItem('token')}`,
  'Accept': '*/*',
  'Content-Type': 'application/json',
});

export const getClients = async (
  page: number = 1,
  pageSize: number = 10,
  filter: string = ''
) => {
  try {
    const response = await axios.get(
      `${API_URL}clients/clients/?page=${page}&page_size=${pageSize}&filter=${filter}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

export const getClientsNormal = async () => {
  try {
    const response = await axios.get(`${API_URL}clients/clientsnormal/`, { headers: getHeaders() });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

export const getClientById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}clients/clients/${id}/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    throw error;
  }
};

export const createClient = async (data: Cliente) => {
  try {
    const response = await axios.post(`${API_URL}clients/clients/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

export const updateClient = async (id: number, data: Cliente) => {
  try {
    const response = await axios.put(`${API_URL}clients/clients/${id}/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

export const deleteClient = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}clients/clients/${id}/`, { headers: getHeaders() });
    console.log('Deleted client:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};

export const getDrivers = async () => {
  console.log(` ${API_URL}clients/conductor/`);
  try {
    const response = await axios.get(
      `${API_URL}clients/conductor/`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    throw error;
  }
};


// obtener los conductores por id http://localhost:8000/clients/clients/2/conductor

export const getDriverById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}clients/clients/${id}/conductor/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching driver by ID:', error);
    throw error;
  }
};

// delete conductor

export const deleteDriver = async (id: number) => {
  
  try {
    const response = await axios.delete(`${API_URL}clients/conductor/${id}/`, { headers: getHeaders() });
    console.log('Deleted driver:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting driver:', error);
    throw error;
  }
}

export const createDriver = async (data: { nombre: string; rut: string; cliente: number }) => {
try {
    const response = await axios.post(`${API_URL}clients/conductor/`, data, { headers: getHeaders() });
    return response.data;
  }
  catch (error) {
      console.error('Error creating driver:', error);
      throw error;
    }
}