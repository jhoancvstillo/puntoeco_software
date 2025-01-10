"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import {
  DispatchTransactionSection,
  ClientSection,
  VehicleSection,
  DateTimeSection,
  WeightsSection,
} from "../index";
import { Cliente } from "@/types/client";
import { PesajeProps, pesajeSchema } from "./schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getClientsNormal, getDrivers } from "@/api/clients";
import { Conductor } from "@/types/conductor";
import DialogConfirmation from "@/components/DialogConfirmation";

interface PesajeFormProps {
  onSubmit: (data: PesajeProps) => void;
}

export function PesajeForm({ onSubmit }: PesajeFormProps) {

  const getFormattedTime = (date: Date) => {
    return date.toTimeString().slice(0, 5); // Devuelve HH:mm
  };
  
  const now = new Date();
  const fiveMinutesBefore = new Date(now.getTime() - 5 * 60 * 1000); // Resta 5 minutos
  

  
  const form = useForm<PesajeProps>({
    resolver: zodResolver(pesajeSchema),
    defaultValues: {
      codigo_producto: "",
      dispatch_guide: "",
      tipo_camion: "",
      cliente: 0,
      conductor: 0,
      patente: "",
      fecha: new Date().toISOString().split("T")[0],
      hora_ingreso: getFormattedTime(fiveMinutesBefore),
      hora_salida: getFormattedTime(now),
      peso_1: "",
      peso_2: "",
    },
  });

  const [clients, setClients] = useState<Cliente[]>([]);
  const [drivers, setDrivers] = useState<Conductor[]>([]);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<PesajeProps | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsData, driversData] = await Promise.all([
          getClientsNormal(),
          getDrivers(),
        ]);
        setClients(clientsData); // Asignamos los datos a `clients`
        setDrivers(driversData); // Asignamos los datos a `drivers`
        console.log("drivers data: " + driversData); // Asignamos los datos a `drivers`
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);


  const handleDialogConfirm = () => {
    if (formData) {
      onSubmit(formData);
      setIsDialogOpen(false);
    }
  };

  const handleDialogCancel = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = form.handleSubmit((data) => {
    setFormData(data); // Almacenar temporalmente los datos
    setIsDialogOpen(true); // Abrir diálogo
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Ticket de Pesaje</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Secciones */}
              <DispatchTransactionSection form={form} />
              <ClientSection
                form={form}
                clients={clients}
                onSelectClient={(client: Cliente) => setSelectedClient(client)}
              />
              <VehicleSection
                form={form}
                drivers={drivers}
                selectedClientId={
                  selectedClient ? String(selectedClient.id) : null
                } // Pasamos el id del cliente seleccionado
              />
              <DateTimeSection form={form} />
              <WeightsSection form={form} />

              {/* BOTONES */}
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
                <Button type="submit">Generar Ticket</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      <DialogConfirmation
        list={
          [
            { key: "codigo_producto", header: "Código de Producto" },
            { key: "dispatch_guide", header: "Guía de Despacho" },
            { key: "tipo_camion", header: "Tipo de Camión" },
            { key: "cliente", header: "Cliente" },
            { key: "conductor", header: "Conductor" },
            { key: "patente", header: "Patente" },
            { key: "fecha", header: "Fecha" },
            { key: "hora_ingreso", header: "Hora de Ingreso" },
            { key: "hora_salida", header: "Hora de Salida" },
            { key: "peso_1", header: "Peso 1" },
            { key: "peso_2", header: "Peso 2" },
          ]
        }
        formData={formData}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        handleDialogCancel={handleDialogCancel}
        handleDialogConfirm={handleDialogConfirm}
      />

    </>
  );
}
