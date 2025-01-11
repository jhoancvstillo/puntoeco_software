import { User } from '@/types/user';
import axios from 'axios';
import { API_URL } from '.';

// const API_URL = 'http://localhost/users/';

export const getUsers = async () => {
    try {
        const headers = {
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
        const response = await axios.get(`${API_URL}users/`, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
}



export async function logout(): Promise<void> {
  const response = await fetch(`${API_URL}users/logout/`, {
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

    const response = await fetch(`${API_URL}users/${id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`, // Incluye el token en el encabezado
        },
    });


    if (!response.ok) throw new Error('Error al eliminar el usuario');
    return response.json();
}

export async function get_current_user(): Promise<User> {
    const token = localStorage.getItem('token'); // Suponiendo que guardaste el token en localStorage

    const response = await fetch(`${API_URL}users/get_current_user/`, {
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

    const response = await fetch(`${API_URL}users/register/`, {
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

export async function updateUser(user:User): Promise<User>{
    const token = localStorage.getItem('token'); // Suponiendo que guardaste el token en localStorage

    const response = await fetch(`${API_URL}users/${user.id}/`, {
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