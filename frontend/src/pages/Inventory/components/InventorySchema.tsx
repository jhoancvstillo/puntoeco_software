import { z } from "zod";



export const InventoryFormSchema = z.object({
    productoId: z.number().int(),
    tipo: z.enum(["add", "remove"]), // Tipo de cambio, debe ser uno de los valores permitidos
    cantidad: z.number().int(), // Cantidad de productos afectados
    observacion: z.string().optional(), // Observaciones adicionales
});


export type InventoryFormProps= z.infer<typeof InventoryFormSchema>;