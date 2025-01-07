import axios from 'axios';

const API_URL = 'http://localhost:8000/finance/';

// Función para obtener encabezados reutilizables
const getHeaders = () => ({
    'Authorization': `Token ${localStorage.getItem('token')}`,
    'Accept': '*/*',
    'Content-Type': 'application/json',
});

// Operaciones para transacciones
export const getTransactions = async () => {
    try {
        const response = await axios.get(`${API_URL}transactions/`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
};

export const createTransaction = async (data: any) => {
    try {
        console.log(data);
        const response = await axios.post(`${API_URL}transactions/`, data, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
    }
};

export const deleteTransaction = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}transactions/${id}/`, { headers: getHeaders() });
        console.log('Deleted transaction:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting transaction:', error);
        throw error;
    }
};

// Operaciones para clasificaciones
export const getClassifications = async () => {
    try {
        const response = await axios.get(`${API_URL}classifications/`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error fetching classifications:', error);
        throw error;
    }
};

export const createClassification = async (data: any) => {
    try {
        const response = await axios.post(`${API_URL}classifications/`, data, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error creating classification:', error);
        throw error;
    }
};

export const deleteClassification = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}classifications/${id}/`, { headers: getHeaders() });
        console.log('Deleted classification:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting classification:', error);
        throw error;
    }
};

// Operaciones para subcategorías
export const getSubcategories = async () => {
    try {
        const response = await axios.get(`${API_URL}subcategories/`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        throw error;
    }
};

export const createSubcategory = async (data: any) => {
    try {
        const response = await axios.post(`${API_URL}subcategories/`, data, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error creating subcategory:', error);
        throw error;
    }
};

export const deleteSubcategory = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}subcategories/${id}/`, { headers: getHeaders() });
        console.log('Deleted subcategory:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting subcategory:', error);
        throw error;
    }
};
