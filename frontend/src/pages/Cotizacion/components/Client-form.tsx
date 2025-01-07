"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, Plus, Trash2 } from "lucide-react";
import { Cliente } from "@/types/client";
import { SearchableInput } from "@/components/forms/SearchabeInput";
import { createCotizacion } from "@/api/cotizacion";
import { Trabajador } from "@/types/worker";
import { cotizacionSchema, cotizacionFormProps } from "./schema";
import { getClientsNormal } from "@/api/clients";
import { getTrabajadores } from "@/api/trabajadores";

export function ClientForm() {
  const [client, setClient] = useState<Cliente[]>([]);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [workers, setWorkers] = useState<Trabajador[]>([]);

  const [, setSelectedWorker] = useState<Trabajador | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<cotizacionFormProps>({
    resolver: zodResolver(cotizacionSchema),
    defaultValues: {
      date_time: new Date(),
      detalles: [{ description: "", value: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detalles",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsData, workersData] = await Promise.all([
          getClientsNormal(),
          getTrabajadores(),
        ]);
        setClient(clientsData);
        setWorkers(workersData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleWorkerSelect = (worker: Trabajador) => {
    setSelectedWorker(worker);
    setValue("worker", worker.id);
  };

  const onSubmit = (data: cotizacionFormProps) => {
    createCotizacion(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="client-select">Seleccionar Cliente</Label>
          <Controller
            name="client"
            control={control}
            render={({ field }) => (
              <SearchableInput
                items={client}
                displayKey="name"
                onSelect={(client) => {
                  field.onChange(client);
                  setValue("client", client.id);
                  setSelectedClient(client); // Guardar el cliente seleccionado
                }}
              />
            )}
          />
          {errors.client && (
            <p className="text-red-500 text-sm mt-1">{errors.client.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="client-rut">RUT</Label>
          <Input
            id="client-rut"
            value={selectedClient?.rut || ""}
            readOnly
            disabled
          />
        </div>
        <div>
          <Label htmlFor="client-address">Dirección</Label>
          <Input
            id="client-address"
            value={selectedClient?.address || ""}
            readOnly
            disabled
          />
        </div>
        <div>
          <Label htmlFor="client-email">Email</Label>
          <Input
            id="client-email"
            value={selectedClient?.mail || ""}
            readOnly
            disabled
          />
        </div>
        <div>
          <Label htmlFor="client-phone">Teléfono</Label>
          <Input
            id="client-phone"
            value={selectedClient?.phoneNumber || ""}
            readOnly
            disabled
          />
        </div>

        <div>
          <Label htmlFor="date-time">Fecha y Hora</Label>
          <Controller
            name="date_time"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(field.value, "PPP HH:mm", { locale: es })
                    ) : (
                      <span>Seleccionar fecha y hora</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-4 space-y-4">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) {
                          const newDateTime = new Date(field.value);
                          newDateTime.setFullYear(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate()
                          );
                          field.onChange(newDateTime);
                        }
                      }}
                      initialFocus
                    />
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <Input
                        type="time"
                        value={format(field.value, "HH:mm")}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":");
                          const newDateTime = new Date(field.value);
                          newDateTime.setHours(
                            parseInt(hours),
                            parseInt(minutes)
                          );
                          field.onChange(newDateTime);
                        }}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.date_time && (
            <p className="text-red-500 text-sm mt-1">
              {errors.date_time.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="requested-by">Solicitado por</Label>
          <Controller
            name="requested_by"
            control={control}
            render={({ field }) => <Input id="requested-by" {...field} />}
          />
          {errors.requested_by && (
            <p className="text-red-500 text-sm mt-1">
              {errors.requested_by.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="processed-by">Realizado por</Label>
          <Controller
            name="worker"
            control={control}
            render={({ field }) => (
              <SearchableInput
                items={workers}
                displayKey="name"
                onSelect={(worker) => {
                  field.onChange(worker);
                  handleWorkerSelect(worker);
                }}
              />
            )}
          />
          {errors.worker && (
            <p className="text-red-500 text-sm mt-1">{errors.worker.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Detalles</Label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2">
            <Controller
              name={`detalles.${index}.description`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Descripción"
                  className="flex-grow"
                />
              )}
            />
            <Controller
              name={`detalles.${index}.value`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="Valor"
                  className="w-24"
                  onChange={(e) => {
                    field.onChange(parseFloat(e.target.value));
                  }}
                />
              )}
            />
            <Button
              type="button"
              onClick={() => {
                if (fields.length > 1) {
                  remove(index);
                }
              }}
              className="p-2"
              variant="outline"
              disabled={fields.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            {errors.detalles?.[index]?.value && (
              <p className="text-red-500 text-sm mt-1">
                {errors.detalles[index]?.value?.message}
              </p>
            )}
          </div>
        ))}

        <Button
          type="button"
          onClick={() => append({ description: "", value: 0 })}
          className="mt-2"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar detalle
        </Button>
      </div>

      <Button type="submit">Enviar</Button>
    </form>
  );
}
