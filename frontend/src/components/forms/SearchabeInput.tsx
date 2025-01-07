"use client";

import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchableInputProps<T> {
  items: T[];
  displayKey: keyof T; // La clave para mostrar en el listado
  onSelect?: (item: T) => void;
}

/**
 * Componente reutilizable de autocompletado.
 * - Filtra dinámicamente elementos según el texto ingresado.
 * - Retorna el elemento seleccionado vía `onSelect`.
 */
export function SearchableInput<T>({
  items,
  displayKey,
  onSelect,
}: SearchableInputProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState<T | null>(null);

  // Filtrado dinámico basado en `searchTerm`
  const filteredItems = React.useMemo(() => {
    if (!searchTerm) return items;
    const lowerSearch = searchTerm.toLowerCase();
    return items.filter((item) =>
      String(item[displayKey]).toLowerCase().includes(lowerSearch)
    );
  }, [items, searchTerm, displayKey]);

  // Manejador para la selección de un elemento
  const handleSelectItem = (item: T) => {
    setSelectedItem(item);
    setOpen(false);
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedItem ? String(selectedItem[displayKey]) : "Seleccionar..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Buscar..."
            value={searchTerm}
            onValueChange={(value) => setSearchTerm(value)}
          />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup heading="Opciones">
              {filteredItems.map((item, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => handleSelectItem(item)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedItem === item ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {String(item[displayKey])}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
