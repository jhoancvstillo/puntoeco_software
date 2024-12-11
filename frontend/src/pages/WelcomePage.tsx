import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Dashboard from '@/pages/Dashboard'
import Gestion from './Gestion'
import PuntoSidebar from './Sidebar'
import Finances from './Finances'
import Transacciones from './Finances/Transacciones'
import FlujoCaja from './Finances/FlujoCaja'
import Clients from './Clients'


interface User {
  id: number
  username: string
  email: string
}

export type ActivePage = 
  | 'dashboard'
  | 'bales'
  | 'hoppers'
  | 'fleet'
  | 'inventory'
  | 'hr'
  | 'clients'
  | 'finance'
  | 'transactions'
  | 'cashflow'
  | 'settings'
  | 'logout';

export default function WelcomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [activePage, setActivePage] = useState<ActivePage>('dashboard')
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      navigate('/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!user) {
    return null
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />
      case 'hoppers':
        return <Gestion />
      case 'clients':
        return <Clients />
      case 'finance':
        return <Finances />
      case 'transactions':
        return <Transacciones />
      case 'cashflow':
        return <FlujoCaja />

      

      // case 'logout':
      //   return <Button onClick={handleLogout} className="w-full">Cerrar sesión</Button>
    }
  }

  return (

    <div className='flex'>
                <div>
                  <PuntoSidebar setActivePage={setActivePage} />
                </div>
                <div>
                  {renderActivePage()}
                </div>
            </div>
    // <div className="flex items-center justify-center min-h-screen bg-gray-100">
    //   <Card className="w-[350px]">
    //     <CardHeader>
    //       <CardTitle>Bienvenido, {user.username}!</CardTitle>
    //       <CardDescription>Nos alegra verte de nuevo</CardDescription>
    //     </CardHeader>
    //     <CardContent>
    //       <p>Email: {user.email}</p>
    //       <p>ID de usuario: {user.id}</p>
    //     </CardContent>
    //     <CardFooter>
    //       <Button onClick={handleLogout} className="w-full">Cerrar sesión</Button>
    //     </CardFooter>
    //   </Card>
    // </div>
  )

}
