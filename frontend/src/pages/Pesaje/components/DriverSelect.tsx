"use client";

import  { useState, useCallback } from "react";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Conductor } from "@/types/conductor";



interface DriverSelectProps {
  drivers: Conductor[];
  form: any;
  selectedClientId: string | null; // Nuevo prop
  onSelect: (driver: Conductor) => void;
}
export function DriverSelect({
  drivers,
  form,
  selectedClientId,
  onSelect,
}: DriverSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  console.log("los conductores son: " , drivers)


  const safeDrivers = Array.isArray(drivers)
  ? drivers.filter(
      (driver) =>
        driver.nombre &&
        driver.rut &&
        (!selectedClientId || driver.cliente === Number(selectedClientId)) // Filtramos por cliente
    )
  : [];

  console.log("los conductores filtrados son: " , safeDrivers)


  // const filteredDrivers = drivers.filter((driver) =>
  //   driver.nombre?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  // );
  const handleInputChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleSelectDriver = useCallback((driver: Conductor) => {
    form.setValue("vehicle.driver.id", driver.id);
    form.setValue("vehicle.driver.nombre", driver.nombre);
    form.setValue("vehicle.driver.rut", driver.rut);
    setSearchTerm(driver.nombre);
    setOpen(false);
    onSelect(driver)
    ;
  }, [form]);

  

  return (
    <FormField
      control={form.control}
      name="vehicle.driver.nombre"
      render={({ field }) => (
        <FormItem className="flex flex-col">
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
                    ? safeDrivers.find((driver) => driver.nombre === field.value)?.nombre
                    : "Seleccione conductor"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput
                  placeholder="Buscar conductor..."
                  value={searchTerm}
                  onValueChange={handleInputChange}
                />
                <CommandList>
                  <CommandEmpty>No se encontraron conductores.</CommandEmpty>
                  <CommandGroup heading="Conductores">
                    {safeDrivers.map((driver) => (
                      <CommandItem
                        key={driver.rut}
                        onSelect={() => handleSelectDriver(driver)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            driver.rut === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {driver.nombre}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {driver.rut}
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
