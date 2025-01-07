import {z} from 'zod';


export const workerSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  position: z.string().min(2, { message: "La posición debe tener al menos 2 caracteres" }),
  join_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Fecha inválida" }),
  status: z.enum(["active", "inactive"]),
  photo: z
    .any()
    .refine(
      (file) => file instanceof FileList && file.length > 0,
      { message: "Debe subir una foto válida" }
    ),
  rut: z.string().regex(/^(\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1})|(\d{7,8}[-][0-9kK]{1})$/, { message: "RUT inválido" }),
  phone: z.string().regex(/^\+?56?\s?(\d{9}|\d{2}\s?\d{4}\s?\d{4})$/, { message: "Número de teléfono inválido" }),
  is_driver: z.boolean(),
});
