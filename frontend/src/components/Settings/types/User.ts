
export interface User {
  id: number
  username: string
  role: string
  password?: string
}

export interface SettingsPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}