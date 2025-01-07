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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface PesajeFormProps {
  onSubmit: (data: PesajeProps) => void;
}

export function PesajeForm({ onSubmit }: PesajeFormProps) {
  const form = useForm<PesajeProps>({
    resolver: zodResolver(pesajeSchema),
    defaultValues: {
      codigo_producto: "",
      dispatch_guide: "",
      tipo_camion: "",
      cliente: 0,
      conductor: 0,
      patente: "",
      fecha: "",
      hora_ingreso: "",
      hora_salida: "",
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

  console.log("los conductores son", drivers);

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
                selectedClientId={selectedClient ? String(selectedClient.id) : null} // Pasamos el id del cliente seleccionado
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

      {/* Diálogo de confirmación */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Ticket de Pesaje</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea registrar este ticket?
            </DialogDescription>
          </DialogHeader>
          {formData && (
            <div className="py-4">
              <p><strong>Código Producto:</strong> {formData.codigo_producto}</p>
              <p><strong>Cliente:</strong> {formData.cliente}</p>
              <p><strong>Patente:</strong> {formData.patente}</p>
              <p><strong>Fecha:</strong> {formData.fecha}</p>
              <p><strong>Peso 1:</strong> {formData.peso_1} kg</p>
              <p><strong>Peso 2:</strong> {formData.peso_2} kg</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogCancel}>
              Cancelar
            </Button>
            <Button onClick={handleDialogConfirm}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
