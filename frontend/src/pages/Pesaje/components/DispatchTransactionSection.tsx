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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { PesajeProps } from "./form/schema";



interface DispatchTransactionSectionProps {
  form: UseFormReturn<PesajeProps>

}

const productCodes = ["Plástico", "Cartón", "Vidrio", "Metales", "Otros"]

export function DispatchTransactionSection({
  form,
}: DispatchTransactionSectionProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Guía de Despacho */}
      <FormField
        control={form.control}
        name="dispatch_guide"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Guía de Despacho</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />


      {/* Código Producto */}
      <FormField
        control={form.control}
        name="codigo_producto"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Código Producto</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione producto" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {productCodes.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
