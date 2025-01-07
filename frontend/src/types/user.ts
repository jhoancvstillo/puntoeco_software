
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
  
}

export interface SettingsPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}