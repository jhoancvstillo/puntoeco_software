import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '@/api/api'; // <-- tu función fetch al backend
import { UserData, LoginResponse } from '@/types/user';

interface AuthContextType {
  isAuthenticated: boolean;
  error: string | null;
  handleLogin: (loginData: UserData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Al montar, revisa si hay token en localStorage. Si existe, setea isAuthenticated en true
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Manejo de login usando la API
  const handleLogin = async (loginData: UserData) => {
    try {
      setError(null); // Limpia errores previos
      const data: LoginResponse = await loginUser(loginData);
      // Guarda token y user en localStorage
      console.log("respuesta de login", data);
      localStorage.setItem('token', data.token);
      console.log("El token es", data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log("El token guardado es", localStorage.getItem('token'));
      setIsAuthenticated(true);
      navigate('/welcome'); // Redirige al usuario
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    }
  };

  // Manejo de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        error,
        handleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
