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
import { CalendarIcon, Clock, Plus, Trash2 } from 'lucide-react';
import { Cliente } from "@/types/client";
import { SearchableInput } from "@/components/forms/SearchabeInput";
import { Trabajador } from "@/types/worker";
import { cotizacionSchema, cotizacionFormProps } from "./schema";
import { getClientsNormal } from "@/api/clients";
import { getTrabajadores } from "@/api/trabajadores";
import DialogConfirmation from "@/components/DialogConfirmation";

export interface CotizacionProps{
  onSubmit: (data: cotizacionFormProps) => void;
}

export function ClientForm({onSubmit}: CotizacionProps) {
  const [client, setClient] = useState<Cliente[]>([]);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [workers, setWorkers] = useState<Trabajador[]>([]);

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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<cotizacionFormProps | null>(null);

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
    setValue("worker", worker.id);
  };

  const handleDialogConfirm = () => {
    if (formData) {
      onSubmit(formData);
      setIsDialogOpen(false);
    }
  };

  const handleDialogCancel = () => {
    setIsDialogOpen(false);
  };


  const handleFormSubmit = handleSubmit((data) => {
    setFormData(data);
    setIsDialogOpen(true);
  });

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-4">
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
                    setSelectedClient(client);
                  }}
                />
              )}
            />
            {errors.client && (
              <p className="text-red-500 text-sm mt-1">
                {errors.client.message}
              </p>
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
              <p className="text-red-500 text-sm mt-1">
                {errors.worker.message}
              </p>
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
      <DialogConfirmation
        list={[
          { key: "client", header: "Cliente" },
          { key: "date_time", header: "Fecha y Hora" },
          { key: "requested_by", header: "Solicitado por" },
          { key: "worker", header: "Realizado por" },
        ]}
        formData={
          // converir fecha a string
          {
            ...formData,
            date_time: formData?.date_time ? format(formData.date_time, "PPP HH:mm", { locale: es }) : "",
            worker: workers.find((worker) => worker.id === formData?.worker)?.name || "",
            client: client.find((client) => client.id === formData?.client)?.name || "",
          }
        }
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        handleDialogCancel={handleDialogCancel}
        handleDialogConfirm={handleDialogConfirm}
      />
    </>
  );
}

