import axios from 'axios';

const API_URL = 'http://localhost:8000/trabajadores/';

// Función para obtener encabezados reutilizables
const getHeaders = () => ({
  'Authorization': `Token ${localStorage.getItem('token')}`,
  'Accept': '*/*',
  'Content-Type': 'application/json',
});

// Trabajadores
export const getTrabajadores = async () => {
  try {
    const response = await axios.get(`${API_URL}trabajadores/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching trabajadores:', error);
    throw error;
  }
};

export const addTrabajador = async (data: FormData) => {
  try {
    const response = await axios.post(`${API_URL}trabajadores/`, data, { headers: 
      // add authoriacaion and accept headers
{ ...getHeaders(), 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding trabajador:', error);
    throw error;
  }
};

export const editTrabajador = async (data: any) => {
  try {
    const response = await axios.put(`${API_URL}trabajadores/${data.id}/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error editing trabajador:', error);
    throw error;
  }
};

export const deleteTrabajador = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}trabajadores/${id}/`, { headers: getHeaders() });
    console.log('Deleted trabajador:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting trabajador:', error);
    throw error;
  }
};

// Attendance
export const getAttendance = async (workerId: number) => {
  try {
    const response = await axios.get(`${API_URL}asistencias/${workerId}/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }
};

// Notes
export const getNotes = async (workerId: number) => {
  try {
    const response = await axios.get(`${API_URL}notas/worker/${workerId}/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

export const editNote = async (data: any) => {
  try {
    const response = await axios.patch(`${API_URL}notas/${data.id}/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error editing note:', error);
    throw error;
  }
};

export const createNote = async (data: any) => {
  try {
    const response = await axios.post(`${API_URL}notas/worker/${data.workerId}/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

export const deleteNote = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}notas/${id}/`, { headers: getHeaders() });
    console.log('Deleted note:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

// Documentos
export const getDocuments = async (workerId: number) => {
  try {
    const response = await axios.get(`${API_URL}documentos/worker/${workerId}/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

export const editDocument = async (data: any) => {
  try {
    const response = await axios.patch(`${API_URL}documentos/${data.id}/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error editing document:', error);
    throw error;
  }
};

export const createDocument = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_URL}documentos/worker/${formData.get('worker')}/`, formData, {
      headers: {
        ...getHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

export const deleteDocument = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}documentos/${id}/`, { headers: getHeaders() });
    console.log('Deleted document:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// Vacaciones
export const getVacations = async (workerId: number) => {
  try {
    const response = await axios.get(`${API_URL}vacaciones-permisos/worker/${workerId}/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching vacations:', error);
    throw error;
  }
};

export const editVacation = async (data: any) => {
  try {
    const response = await axios.patch(`${API_URL}vacaciones-permisos/${data.id}/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error editing vacation:', error);
    throw error;
  }
};

export const createVacation = async (data: any) => {
  try {
    const response = await axios.post(`${API_URL}vacaciones-permisos/worker/${data.workerId}/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error creating vacation:', error);
    throw error;
  }
};

export const deleteVacation = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}vacaciones-permisos/${id}/`, { headers: getHeaders() });
    console.log('Deleted vacation:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting vacation:', error);
    throw error;
  }
};

// Payments
export const getPayments = async (workerId: number) => {
  try {
    const response = await axios.get(`${API_URL}pagos/worker/${workerId}/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

export const editPayment = async (data: any) => {
  try {
    const response = await axios.patch(`${API_URL}pagos/${data.id}/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error editing payment:', error);
    throw error;
  }
};

export const createPayment = async (data: any) => {
  try {
    const response = await axios.post(`${API_URL}pagos/worker/${data.worker}/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const deletePayment = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}pagos/${id}/`, { headers: getHeaders() });
    console.log('Deleted payment:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting payment:', error);
    throw error;
  }
};

// Capacitaciones
export const getTrainings = async (workerId: number) => {
  try {
    const response = await axios.get(`${API_URL}capacitaciones/worker/${workerId}/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching trainings:', error);
    throw error;
  }
};

export const editTraining = async (data: any) => {
  try {
    const response = await axios.patch(`${API_URL}capacitaciones/${data.id}/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error editing training:', error);
    throw error;
  }
};

export const createTraining = async (data: any) => {
  try {
    const response = await axios.post(`${API_URL}capacitaciones/worker/${data.worker}/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error creating training:', error);
    throw error;
  }
};

export const deleteTraining = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}capacitaciones/${id}/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error deleting training:', error);
    throw error;
  }
};

// Incidentes
export const getIncidents = async (workerId: number) => {
  try {
    const response = await axios.get(`${API_URL}incidentes/worker/${workerId}/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching incidents:', error);
    throw error;
  }
};

export const editIncident = async (data: any) => {
  try {
    const response = await axios.put(`${API_URL}incidentes/${data.id}/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error editing incident:', error);
    throw error;
  }
};

export const createIncident = async (data: any) => {
  try {
    const response = await axios.post(`${API_URL}incidentes/worker/${data.worker}/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error creating incident:', error);
    throw error;
  }
};

export const deleteIncident = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}incidentes/${id}/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error deleting incident:', error);
    throw error;
  }
};
