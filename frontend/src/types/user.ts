
export interface UserData {
    username: string
    password: string
    email?: string
  }
  
export interface LoginResponse {
    token: string
    user:UserData
  }