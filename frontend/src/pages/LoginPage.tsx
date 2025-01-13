import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import IconHeader from "../components/layout/IconHeader"
import ForgotPasswordLink from "../components/forms/ForgotPasswordLink"
import InputField from '../components/forms/InputField'
import ErrorMessage from '../components/forms/ErrorMessage'
import { useDarkMode } from '../hooks/useDarkMode'
import { useAuth } from '../pages/AuthContext'  // <--- O la ruta donde está tu AuthContext
import { UserData } from '../types/user'
import { Moon, Sun } from 'lucide-react'

export default function LoginPage() {
  const [loginData, setLoginData] = useState<UserData>({ username: '', password: '' })
  const { darkMode, toggleDarkMode } = useDarkMode()

  const { handleLogin, error } = useAuth()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(loginData);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-blue-50'
      }`}
    >
      <Card
        className={`w-full max-w-md shadow-xl ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-green-200'
        }`}
      >
        <CardHeader className="space-y-1 text-center relative">
          <button
            onClick={toggleDarkMode}
            className="absolute top-2 right-2 p-2 rounded-full bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200"
            aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-300" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </button>
          <IconHeader darkMode={darkMode} />
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {error && <ErrorMessage message={error} />}
            <InputField
              id="username"
              label="Nombre de usuario"
              type="text"
              value={loginData.username}
              onChange={(e) =>
                setLoginData({ ...loginData, username: e.target.value })
              }
              darkMode={darkMode}
            />
            <InputField
              id="password"
              label="Contraseña"
              type="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              darkMode={darkMode}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className={`w-full font-semibold ${
                darkMode
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              Iniciar sesión
            </Button>
          </CardFooter>
        </form>
        <ForgotPasswordLink darkMode={darkMode} />
      </Card>
    </div>
  );
}
