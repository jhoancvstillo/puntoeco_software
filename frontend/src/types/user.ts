
export interface UserData {
    username: string
    password: string
    email?: string
  }
  
export interface LoginResponse {
    token: string
    user:UserData
  }

  
export interface User {
  id: number
  username: string
  email: string
  role_input?: string
  role?: string
  password?: string
  permisos?: {
    dashboard?: boolean
    combustible?: boolean
    fardos?: boolean
    vertedero?: boolean
    pesaje?: boolean
    cotizacion?: boolean
    disposicionfinal?: boolean
    products?: boolean
    trabajadores?: boolean
    clientes?: boolean
    finanzas?: boolean
    configuracion?: boolean
  }
  
}

export interface SettingsPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}