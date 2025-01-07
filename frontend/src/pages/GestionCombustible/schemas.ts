import * as z from "zod"

export const fuelFormSchema = z.object({
  fecha: z.date({
    required_error: "La fecha es requerida",
  }),
  hora: z.string({
    required_error: "La hora es requerida",
  }),
  conductor: z.object({
    id: z.number(),
    nombre: z.string(),
  }, {
    required_error: "El conductor es requerido",
  }),
  patente: z.string({
    required_error: "La patente es requerida",
  }).min(6, "La patente debe tener al menos 6 caracteres"),
  guia: z.string({
    required_error: "El número de guía es requerido",
  }),
  litros: z.number({
    required_error: "Los litros son requeridos",
  }).min(1, "Los litros deben ser mayores a 0"),
  valor_litro: z.number({
    required_error: "El valor por litro es requerido",
  }).min(1, "El valor por litro debe ser mayor a 0"),
  tarjeta: z.string({
    required_error: "El número de tarjeta es requerido",
  }),
  observaciones: z.string().optional(),
})

export type FuelFormValues = z.infer<typeof fuelFormSchema>

