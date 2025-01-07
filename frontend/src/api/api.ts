import { UserData, LoginResponse } from '@/types/user';

export async function loginUser(loginData: UserData): Promise<LoginResponse> {
  const response = await fetch('http://localhost:8000/users/login/', {
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
