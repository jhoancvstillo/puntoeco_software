
import {z} from "zod";


const DetalleCotizacionSchema = z.object({
  description: z.string().min(1, 'La descripción es obligatoria'), // Descripción del detalle
  value: z.number().positive('El valor debe ser positivo'), // Valor del detalle
});


export const cotizacionSchema = z.object({
 client: z.number().positive("Debes seleccionar un cliente"),
  requested_by: z.string().nonempty("Debes ingresar el solicitante"),
  worker: z.number().positive("Debes seleccionar un trabajador"),
  date_time: z.date(),
  detalles: z.array(DetalleCotizacionSchema).nonempty('Debe incluir al menos un detalle'), // Array de detalles

});


export type cotizacionFormProps = z.infer<typeof cotizacionSchema>;
