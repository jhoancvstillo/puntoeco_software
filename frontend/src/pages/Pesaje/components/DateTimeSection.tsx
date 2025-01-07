"use client"

import { UseFormReturn } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PesajeProps } from "../components/form/schema"

interface DateTimeSectionProps {
  form: UseFormReturn<PesajeProps>
}

export function DateTimeSection({ form }: DateTimeSectionProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="fecha"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hora_ingreso"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hora Ingreso</FormLabel>
            <FormControl>
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hora_salida"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hora Salida</FormLabel>
            <FormControl>
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
