"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PesajeProps } from "../components/form/schema";
import { DriverSelect } from "../components/DriverSelect";
import { Conductor } from "@/types/conductor";
import { useState } from "react";
import { Label } from "@/components/ui/label";

interface VehicleSectionProps {
  form: UseFormReturn<PesajeProps>;
  drivers: Conductor[];
  selectedClientId: string | null;
}

export function VehicleSection({
  form,
  drivers,
  selectedClientId,
}: VehicleSectionProps) {
  const [selectedRut, setSelectedRut] = useState<string>("");

  const handleSelectDriver = (driver: Conductor) => {
    setSelectedRut(driver.rut);
    form.setValue("conductor", driver.id);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="patente"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Patente</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tipo_camion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Camión</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <Label htmlFor="driver-select">Conductor</Label>
        <DriverSelect
          drivers={drivers}
          form={form}
          selectedClientId={selectedClientId}
          onSelect={handleSelectDriver}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rut-conductor">RUT Conductor</Label>
        <Input
          id="rut-conductor"
          type="text"
          value={selectedRut}
          className="w-full"
          disabled
        />
      </div>
    </div>
  );
}
