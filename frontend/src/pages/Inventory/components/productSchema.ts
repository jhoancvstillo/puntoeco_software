import { z } from "zod";

export const productSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  categoria: z.number().int().positive("La categoría es requerida"),
  marca: z.number().int().positive("La marca es requerida"),
  precio_por_unidad: z.string().min(1, "El precio es requerido"),
  stocks: z.array(
    z.object({
      id: z.number().int(),
      ubicacion: z.string().min(1, "La ubicación es requerida"),
      cantidad: z.number().int().nonnegative("La cantidad debe ser 0 o mayor"),
      stock_minimo: z.number().int().nonnegative("El stock mínimo debe ser 0 o mayor"),
    })
  ).nonempty("Al menos un stock es requerido"),
});

export type ProductSchemaType = z.infer<typeof productSchema>;
