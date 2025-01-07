export type Categoria = 'metales' | 'plasticos' | 'fibras' | 'fitosanitarios';

interface BaseFormData {
  folio: string;
  categoria: Categoria;
  cliente: {
    nombre: string;
    rut: string;
    domicilio: string;
  };
  guiaNro: string;
  certificadoNro: string;
  destinoFinal: string;
  periodo: string;
}

export interface MaterialFormData extends BaseFormData {
  material: {
    tipo: string;
    cantidad: string;
    unidad: string;
  };
}

export interface PlasticosFormData extends BaseFormData {
  clasificacionResinas: string;
}

export interface FitosanitariosFormData extends BaseFormData {
  cantidades: {
    [key: string]: string; // litros como key, cantidad como value
  };
}

export type FormData = MaterialFormData | PlasticosFormData | FitosanitariosFormData;
