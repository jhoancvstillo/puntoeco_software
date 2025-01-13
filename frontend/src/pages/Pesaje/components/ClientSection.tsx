"use client"

import { UseFormReturn } from "react-hook-form"
import { PesajeProps } from "../components/form/schema"
import { ClientSelect } from "../components/ClientSelect"
import { Cliente } from "@/types/client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface ClientSectionProps {
  form: UseFormReturn<PesajeProps>;
  clients: Cliente[];
  onSelectClient: (client: Cliente) => void;
}

export function ClientSection({ form, clients, onSelectClient }: ClientSectionProps) {
  const [selectedRut, setSelectedRut] = useState<string>('');

  const handleSelectClient = (client: Cliente) => {
    setSelectedRut(client.rut);
    form.setValue("cliente", client.id);
    onSelectClient(client);
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <ClientSelect
          clients={clients}
          form={form}
          onSelect={handleSelectClient}
        />
      </div>
      <div className="">
        <Label htmlFor="rut">RUT Cliente</Label>
        <Input
          id="rut"
          type="text"
          value={selectedRut}
          className="w-full"
          disabled
        />
      </div>
      <div>
        {/* agregar nuevo conductor */}
      </div>
    </div>
  );
}

