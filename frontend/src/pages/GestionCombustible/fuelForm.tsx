"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Clock } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { SearchableInput } from "@/components/forms/SearchabeInput"
import { fuelFormSchema, type FuelFormValues } from "./schemas"

import { createCombustible } from "@/api/combustible"
import { Combustible, CombustibleSinTotal } from "@/types/combustible"
import { Conductor } from "@/types/conductor"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


interface FuelFormProps {
  conductores: Conductor[],
  // para enviar al componente padre la información del formulario
  onFormSubmit: (data: Combustible) => void
}

export function FuelForm( { conductores, onFormSubmit }: FuelFormProps ) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<FuelFormValues | null>(null)

  const form = useForm<FuelFormValues>({
    resolver: zodResolver(fuelFormSchema),
    defaultValues: {
      fecha: new Date(),
      hora: format(new Date(), "HH:mm"),
      litros: 0,
      valor_litro: 0,
    },
  })

  const transformData = (data: FuelFormValues): CombustibleSinTotal => {
    return {
      fecha: format(data.fecha, "yyyy-MM-dd"),
      hora: data.hora,
      conductor: data.conductor.id,
      patente: data.patente,
      guia: data.guia,
      litros: data.litros.toString(),
      valor_litro: data.valor_litro.toString(),
      tarjeta: data.tarjeta,
      observaciones: data.observaciones || ""
    }
  }

  function onSubmit(data: FuelFormValues) {
    setFormData(data)
    setIsDialogOpen(true)
  }

  function handleConfirm() {
    if (formData) {
      const transformedData = transformData(formData)
      console.log("Datos enviados desde el formulario:", transformedData)
      createCombustible(transformedData)
        .then((response) => {
          console.log("Combustible creado:", response)
          setIsDialogOpen(false)
          form.reset()
          onFormSubmit(response)
        })
        .catch((error) => {
          console.error("Error al crear combustible:", error)
          setIsDialogOpen(false)
        })
    }
  }

  const total = form.watch("litros") * form.watch("valor_litro") || 0

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fecha */}
          <FormField
            control={form.control}
            name="fecha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "P", { locale: es })
                        ) : (
                          <span>Seleccione una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hora */}
          <FormField
            control={form.control}
            name="hora"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="time" {...field} />
                    <Clock className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Guía */}
          <FormField
            control={form.control}
            name="guia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guía</FormLabel>
                <FormControl>
                  <Input placeholder="Número de guía" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Conductor */}
          <FormField
            control={form.control}
            name="conductor"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Conductor</FormLabel>
                <FormControl>
                  <SearchableInput
                    items={conductores}
                    displayKey="nombre"
                    onSelect={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Patente */}
          <FormField
            control={form.control}
            name="patente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patente</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese la patente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tarjeta */}
          <FormField
            control={form.control}
            name="tarjeta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarjeta</FormLabel>
                <FormControl>
                  <Input placeholder="Tarjeta utilizada" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Litros */}
          <FormField
            control={form.control}
            name="litros"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Litros</FormLabel>
                <FormControl>
                  <Input 
                    type="text"
                    inputMode="decimal"
                    placeholder="0"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '')
                      const parts = value.split('.')
                      if (parts.length > 2) {
                        return
                      }
                      field.onChange(value === '' ? '' : parseFloat(value))
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Valor por Litro */}
          <FormField
            control={form.control}
            name="valor_litro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor por Litro</FormLabel>
                <FormControl>
                  <Input 
                    type="text"
                    inputMode="decimal"
                    placeholder="0"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '')
                      const parts = value.split('.')
                      if (parts.length > 2) {
                        return
                      }
                      field.onChange(value === '' ? '' : parseFloat(value))
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Total */}
          <FormItem>
            <FormLabel>Total</FormLabel>
            <Input 
              value={total.toLocaleString('es-CL', { 
                style: 'currency', 
                currency: 'CLP' 
              })} 
              disabled 
            />
          </FormItem>
        </div>

        {/* Observaciones */}
        <FormField
          control={form.control}
          name="observaciones"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observaciones</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Observaciones adicionales"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Guardar
        </Button>
      </form>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar ingreso de combustible</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea ingresar los siguientes datos?
            </DialogDescription>
          </DialogHeader>
          {formData && (
            <div className="grid grid-cols-2 gap-4">
              <div>Fecha: {format(formData.fecha, "P", { locale: es })}</div>
              <div>Hora: {formData.hora}</div>
              <div>Guía: {formData.guia}</div>
              <div>Conductor: {formData.conductor.nombre}</div>
              <div>Patente: {formData.patente}</div>
              <div>Tarjeta: {formData.tarjeta}</div>
              <div>Litros: {formData.litros}</div>
              <div>Valor por Litro: {formData.valor_litro}</div>
              <div className="col-span-2">
                Total: {(formData.litros * formData.valor_litro).toLocaleString('es-CL', { 
                  style: 'currency', 
                  currency: 'CLP' 
                })}
              </div>
              {formData.observaciones && (
                <div className="col-span-2">
                  Observaciones: {formData.observaciones}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  )
}

