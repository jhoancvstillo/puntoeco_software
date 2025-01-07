import { z } from "zod";

// Validación de peso
const weightSchema = z.object({
  actualWeight: z.number().min(0, { message: "El peso debe ser mayor o igual a 0" }),
});

// Esquema completo
export const pesajeSchema = z.object({
  codigo_producto: z.string(),
  dispatch_guide: z.string().nullable(),
  tipo_camion: z.string(),
  cliente: z.number(),
  conductor: z.number(),
  patente: z.string(),
  fecha: z.string(),
  hora_ingreso: z.string(),
  hora_salida: z.string(),
  peso_1: z.string(),
  peso_2: z.string(),
  weights: z.array(weightSchema).optional(), // Para múltiples pesos
});

export type PesajeProps = z.infer<typeof pesajeSchema>;
