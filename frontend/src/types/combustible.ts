export interface Combustible {
  id?: number;
  fecha: string;
  hora: string;
  patente: string;
  conductor: number;
  conductor_nombre?: string;
  conductor_rut?: string;
  litros: string;
  valor_litro: string;
  total: string; // Cambiado de opcional a requerido y siempre string
  tarjeta: string;
  guia: string;
  observaciones: string;
}

export type CombustibleSinTotal = Omit<Combustible, 'total'>;