// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { loginUser } from '@/api/api';
// import { UserData, LoginResponse } from '@/types/user';

// export function useAuth() {
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   //Si el usuario esta autenticado, redirigir a la página de bienvenida
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       navigate('/welcome');
//     }
//   }, [navigate]);

//   const handleLogin = async (loginData: UserData) => {
//     try {
//       const data: LoginResponse = await loginUser(loginData);
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));
//       navigate('/welcome');
//     } catch (error : any) {
//       setError(error.message || 'Error de conexión');
//     }
//   };

// //   return { handleLogin, error, setError };
//   return {  handleLogin, error, setError };

// }
