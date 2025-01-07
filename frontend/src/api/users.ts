import { User } from '@/types/user';
import axios from 'axios';

const API_URL = 'http://localhost:8000/users/';

export const getUsers = async () => {
    try {
        const headers = {
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
        const response = await axios.get(`${API_URL}`, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
}



export async function logout(): Promise<void> {
  const response = await fetch(`${API_URL}logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Error en el inicio de sesión');
  return response.json();
}

export async function deleteUser(id: number): Promise<void> {
    const token = localStorage.getItem('token'); // Suponiendo que guardaste el token en localStorage

    const response = await fetch(`${API_URL}${id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`, // Incluye el token en el encabezado
        },
    });

    console.log("La response es", response);

    if (!response.ok) throw new Error('Error al eliminar el usuario');
    return response.json();
}

export async function get_current_user(): Promise<User> {
    const token = localStorage.getItem('token'); // Suponiendo que guardaste el token en localStorage

    const response = await fetch(`${API_URL}get_current_user/`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`, // Incluye el token en el encabezado
    },
  });
  if (!response.ok) throw new Error('Error en el inicio de sesión');
  return response.json();
}


export async function createUser(user:Omit<User, "id">): Promise<User>{
    const token = localStorage.getItem('token'); // Suponiendo que guardaste el token en localStorage

    const response = await fetch(`${API_URL}register/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`, // Incluye el token en el encabezado
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) throw new Error('Error al crear el usuario');
    return response.json();
}

// http://localhost:8000/users/14/

export async function updateUser(user:User): Promise<User>{
    const token = localStorage.getItem('token'); // Suponiendo que guardaste el token en localStorage

    const response = await fetch(`${API_URL}${user.id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`, // Incluye el token en el encabezado
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) throw new Error('Error al actualizar el usuario');
    return response.json();
}