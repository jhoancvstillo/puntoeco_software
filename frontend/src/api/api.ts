import { UserData, LoginResponse } from '@/types/user';
import { API_URL } from '.';



export async function loginUser(loginData: UserData): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}users/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });
  if (!response.ok) throw new Error('Error en el inicio de sesión');
  return response.json();
}
