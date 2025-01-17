"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { SearchableInput } from "@/components/forms/SearchabeInput";
import { fuelFormSchema, type FuelFormValues } from "./schemas";

import { createCombustible } from "@/api/combustible";
import { Combustible, CombustibleSinTotal } from "@/types/combustible";
import { Conductor } from "@/types/conductor";

import DialogConfirmation from "@/components/DialogConfirmation";

interface FuelFormProps {
  conductores: Conductor[];
  // para enviar al componente padre la información del formulario
  onFormSubmit: (data: Combustible) => void;
}

export function FuelForm({ conductores, onFormSubmit }: FuelFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FuelFormValues | null>(null);

  const form = useForm<FuelFormValues>({
    resolver: zodResolver(fuelFormSchema),
    defaultValues: {
      fecha: new Date(),
      hora: format(new Date(), "HH:mm"),
      litros: 0,
      valor_litro: 0,
    },
  });

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
      observaciones: data.observaciones || "",
    };
  };

  function onSubmit(data: FuelFormValues) {
    setFormData(data);
    setIsDialogOpen(true);
    // console.log("se esta enviando en onSubmit", data)
  }

  function handleConfirm() {
    if (formData) {
      const transformedData = transformData(formData);
      console.log("se va a enviar: ", transformedData);
      createCombustible(transformedData)
        .then((response) => {
          setIsDialogOpen(false);
          form.reset();
          onFormSubmit(response);
        })
        .catch((error) => {
          console.error("Error al crear combustible:", error);
          setIsDialogOpen(false);
        });
    }
  }

  const total_neto = form.watch("litros") * form.watch("valor_litro") || 0;
  const iva = total_neto * 0.19;
  const total = total_neto + iva;
  // total = litros * valor_litro + iva

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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
                      // Obtener el valor ingresado
                      let value = e.target.value;

                      // Permitir solo números y un único punto decimal
                      value = value.replace(/[^0-9.]/g, "");

                      // Si hay más de un punto decimal, ignorar el cambio
                      if ((value.match(/\./g) || []).length > 1) {
                        return;
                      }

                      // Actualizar el campo con el valor limpio
                      field.onChange(value === "" ? "" : value);
                    }}
                    onBlur={(e) => {
                      // Al salir del campo, convertir a número si es válido
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        field.onChange(value);
                      }
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
                      // Obtener el valor ingresado
                      let value = e.target.value;

                      // Permitir solo números y un único punto decimal
                      value = value.replace(/[^0-9.]/g, "");

                      // Si hay más de un punto decimal, ignorar el cambio
                      if ((value.match(/\./g) || []).length > 1) {
                        return;
                      }

                      // Actualizar el campo con el valor limpio
                      field.onChange(value === "" ? "" : value);
                    }}
                    onBlur={(e) => {
                      // Al salir del campo, convertir a número si es válido
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        field.onChange(value);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Totalneto  */}
          <FormItem>
            <FormLabel>Total Neto</FormLabel>
            <Input
              value={total_neto.toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
              })}
              disabled
            />
          </FormItem>
          {/* IVA */}
          <FormItem>
            <FormLabel>IVA</FormLabel>
            <Input
              value={iva.toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
              })}
              disabled
            />
          </FormItem>
          {/* Tota  l Neto */}

          <FormItem>
            <FormLabel>Total</FormLabel>
            <Input
              value={total.toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
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

      <DialogConfirmation
        list={[
          { key: "fecha", header: "Fecha" },
          { key: "hora", header: "Hora" },
          { key: "guia", header: "Guía" },
          { key: "conductor", header: "Conductor" },
          { key: "patente", header: "Patente" },
          { key: "tarjeta", header: "Tarjeta" },
          { key: "litros", header: "Litros" },
          { key: "valor_litro", header: "Valor por Litro" },
          { key: "observaciones", header: "Observaciones" },
        ]}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        formData={
          formData
            ? {
                ...formData,
                conductor: formData.conductor.nombre,
                fecha: formData.fecha
                  ? format(formData.fecha, "P", { locale: es })
                  : null,
              }
            : null
        }
        handleDialogCancel={() => setIsDialogOpen(false)}
        handleDialogConfirm={handleConfirm}
      />
    </Form>
  );
}
