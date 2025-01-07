import axios from 'axios';

const API_URL = 'http://localhost:8000/destinofinal/'; // Cambia esto según la configuración de tu API

// Función para obtener encabezados reutilizables
const getHeaders = () => ({
    'Authorization': `Token ${localStorage.getItem('token')}`,
    'Accept': '*/*',
    'Content-Type': 'application/json',
});

// Operaciones para Certificados
export const getCertificados = async () => {
    try {
        const response = await axios.get(`${API_URL}certificados/`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error fetching certificados:', error);
        throw error;
    }
};

export const createCertificado = async (data: any) => {
    try {
        console.log('Creating certificado with data:', data);
        const response = await axios.post(`${API_URL}certificados/`, data, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error creating certificado:', error);
        throw error;
    }
};

export const deleteCertificado = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}certificados/${id}/`, { headers: getHeaders() });
        console.log('Deleted certificado:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting certificado:', error);
        throw error;
    }
};

// Operaciones para Detalles Específicos (Por Categoría)

// Plásticos
export const getPlasticos = async () => {
    try {
        const response = await axios.get(`${API_URL}plastico-detalle/`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error fetching plasticos:', error);
        throw error;
    }
};

export const createPlastico = async (data: { certificado: number, clasificacion_resinas: string, cantidad_kg: number }) => {
    console.log("creando el plastico con: ", data)
    try {
        const response = await axios.post(`${API_URL}plastico-detalle/`, data, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error creating plastico:', error);
        throw error;
    }
};

export const deletePlastico = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}plastico-detalle/${id}/`, { headers: getHeaders() });
        console.log('Deleted plastico:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting plastico:', error);
        throw error;
    }
};

// Fitosanitarios
export const getFitosanitarios = async () => {
    try {
        const response = await axios.get(`${API_URL}fitosanitario-detalle/`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error fetching fitosanitarios:', error);
        throw error;
    }
};

export const createFitosanitario = async (data: any) => {
    try {
        const response = await axios.post(`${API_URL}fitosanitario-detalle/`, data, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error creating fitosanitario:', error);
        throw error;
    }
};

export const deleteFitosanitario = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}fitosanitario-detalle/${id}/`, { headers: getHeaders() });
        console.log('Deleted fitosanitario:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting fitosanitario:', error);
        throw error;
    }
};

// Materiales (Metales y Fibras)
export const getMateriales = async () => {
    try {
        const response = await axios.get(`${API_URL}material-detalle/`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error fetching materiales:', error);
        throw error;
    }
};

export const createMaterial = async (data: {certificado: number, material:string, cantidad_kg:number}) => {
    try {
        const response = await axios.post(`${API_URL}material-detalle/`, data, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error creating material:', error);
        throw error;
    }
};

export const deleteMaterial = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}material-detalle/${id}/`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error deleting material:', error);
        throw error;
    }
};

interface CertificadoRequest {
    client_id: number;
    fecha_inicio: string;
    fecha_final: string;
}

export const descargarCertificadoDF = async (data: CertificadoRequest): Promise<void> => {
    try {
        const response = await axios.post(`${API_URL}certificados/generate_zip/`, data, {
            headers: getHeaders(),
            responseType: 'blob', // Configurar para manejar binarios
        });

        // Crear un enlace de descarga para el archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'certificados.zip'); // Nombre del archivo a descargar
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Limpiar el DOM
    } catch (error) {
        console.error('Error fetching certificados:', error);
        throw error;
    }
};


// POST /certificado/{id}/generate_pdf/


export const generate_pdf = async (id: number): Promise<void> => {
    try {
        await axios.post(`${API_URL}certificados/${id}/generate_pdf/`, {}, {
            headers: getHeaders(),
            responseType: 'blob', // Configurar para manejar binarios
        });
    } catch (error) {
        console.error('Error fetching certificados:', error);
        throw error;
    }
}
