
export type EntradaFinanciera = {
    id: string
    descripcion: string
    monto: number[]
  }
  
export type EstadoFinanciero = {
    ingresos: EntradaFinanciera[]
    egresos: EntradaFinanciera[]
  }
  