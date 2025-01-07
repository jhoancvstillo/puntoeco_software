// types/weight-ticket.ts

import { PesajeProps } from "../components/form/schema"

export interface Cliente {
  id: number
  name: string
  rut: string
}


export interface UsePesajeFormProps {
  onSubmit: (data: PesajeProps) => void
  formSchema: any  // zod schema
  defaultValues: Partial<PesajeProps>
}
