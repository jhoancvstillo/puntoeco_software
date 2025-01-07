import { addBalesForm, addDebtForm, addDispatchForm } from '@/pages/GestionFardos/types/types';
import axios from 'axios';

const API_URL = 'http://localhost:8000/fardos/'; // Base de la URL de la API

const getHeaders = () => ({
    'Authorization': `Token ${localStorage.getItem('token')}`,
    'Accept': '*/*',
    'Content-Type': 'application/json',
});

// Operaciones para Producción de Fardos
export const getProductions = async () => {
    try {
        const response = await axios.get(`${API_URL}productions/`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error fetching productions:', error);
        throw error;
    }
};

export const deleteProduction = async (id: number): Promise<void> => {
    try {
        const response = await axios.delete(`${API_URL}productions/${id}/`, { headers: getHeaders() });
        console.log('Deleted production:', response.data);
    } catch (error) {
        console.error('Error deleting production:', error);
        throw error;
    }
};

export const addProduction = async (data: addBalesForm): Promise<addBalesForm> => {
    try {
        const response = await axios.post(`${API_URL}productions/`, data, { headers: getHeaders() });
        console.log('Added production:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding production:', error);
        throw error;
    }
};

// Operaciones para Despacho de Fardos
export const getDispatches = async () => {
    try {
        const response = await axios.get(`${API_URL}dispatches/`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error fetching dispatches:', error);
        throw error;
    }
};

export const createDispatch = async (data: addDispatchForm): Promise<addDispatchForm> => {
    try {
        console.log('Creating dispatch with data:', data);
        const response = await axios.post<addDispatchForm>(`${API_URL}dispatches/`, data, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error creating dispatch:', error);
        throw error;
    }
};

export const deleteDispatch = async (id: number): Promise<void> => {
    try {
        const response = await axios.delete(`${API_URL}dispatches/${id}/`, { headers: getHeaders() });
        console.log('Deleted dispatch:', response.data);
    } catch (error) {
        console.error('Error deleting dispatch:', error);
        throw error;
    }
};

// Operaciones para Control de Deuda
export const getDebts = async () => {
    try {
        const response = await axios.get(`${API_URL}debts/`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error fetching debts:', error);
        throw error;
    }
};

export const createDebt = async (data: addDebtForm): Promise<addDebtForm> => {
    try {
        console.log('Creating debt with data:', data);
        const response = await axios.post<addDebtForm>(`${API_URL}debts/`, data, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error creating debt:', error);
        throw error;
    }
};

export const deleteDebt = async (id: number): Promise<void> => {
    try {
        const response = await axios.delete(`${API_URL}debts/${id}/`, { headers: getHeaders() });
        console.log('Deleted debt:', response.data);
    } catch (error) {
        console.error('Error deleting debt:', error);
        throw error;
    }
};
