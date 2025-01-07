"use client";

import { useState, useCallback } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFilteredClients } from "../hooks/useFilteredClients";
import { Cliente } from "@/types/client";
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ClientSelectProps {
  clients: Cliente[];
  form: any;
  onSelect: (client: Cliente) => void;
}
export function ClientSelect({ clients, form, onSelect }: ClientSelectProps) {
  const handleSelectClient = useCallback((client: Cliente) => {
    form.setValue("client.id", client.id);    // <--- nuevo
    form.setValue("client.name", client.name);
    form.setValue("client.rut", client.rut);
    onSelect(client); // Pasamos el cliente al padre
  }, [form, onSelect]);


  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const safeClients = Array.isArray(clients) ? clients : [];
  const filteredClients = useFilteredClients(safeClients, searchTerm);

  const handleInputChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);



  return (
    <FormField
      control={form.control}
      name="client.name"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Cliente</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {field.value
                    ? safeClients.find((client) => client.name === field.value)?.name
                    : "Seleccionar cliente..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput 
                  placeholder="Buscar cliente..." 
                  value={searchTerm}
                  onValueChange={handleInputChange}
                />
                <CommandList>
                  <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                  <CommandGroup heading="Clientes">
                    {filteredClients.map((client) => (
                      <CommandItem
                        key={client.rut}
                        onSelect={() => handleSelectClient(client)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            client.name === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {client.name}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {client.rut}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

