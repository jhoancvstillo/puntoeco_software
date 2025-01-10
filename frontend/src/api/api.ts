import { UserData, LoginResponse } from '@/types/user';

const url = 'http://54.87.57.69:8000/users/';


export async function loginUser(loginData: UserData): Promise<LoginResponse> {
  const response = await fetch(`${url}login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Token ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(loginData),
  });
  if (!response.ok) throw new Error('Error en el inicio de sesión');
  return response.json();
}
