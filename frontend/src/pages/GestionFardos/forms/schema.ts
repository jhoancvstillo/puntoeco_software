import { z } from "zod";

// ----------- zod validation schema for addBales -----------------
// http://localhost:8000/fardos/productions/
// La api necesita lo siguiente: 

// {
//     "date": "2024-12-04",
//     "bales": 100
//   }


export const addBalesSchema = z.object({
    date: z.string(),
    bales: z.coerce.number().min(1,{message: "Debe ingresar al menos un fardo"}), //coerce convierte el string a number
    });

export const addDispatchSchema = z.object({
    date: z.string(),
    bales: z.coerce.number().min(1,{message: "Debe ingresar al menos un fardo"}),
    destination: z.string(),
    });

export const addDebtSchema = z.object({
    date: z.string(),
    reported_weight: z.coerce.number().min(1,{message: "Debe ingresar al menos un kilo"}),
    accepted_weight: z.coerce.number().min(1,{message: "Debe ingresar al menos un kilo"}),
    });


