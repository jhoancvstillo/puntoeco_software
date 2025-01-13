"use client";

import { useState, useCallback, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Producto } from "../types/inventory";
import { getProductos } from "@/api/productos";

interface ProductSelectProps {
  //   producto: Producto[];
  form: any;
  onSelect: (producto: Producto) => void;
}

export function ProductSelect({ form, onSelect }: ProductSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [producto, setProducto] = useState<Producto[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductos();
        setProducto(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  // Filtrar productos por nombre
  const filteredProducts = producto.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProduct = useCallback(
    (selectedProduct: Producto) => {
      form.setValue("productoId", selectedProduct.id); // Guardar ID en el formulario
      onSelect(selectedProduct); // Notificar al padre
      setOpen(false); // Cerrar el Popover
    },
    [form, onSelect]
  );

  const handleInputChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  return (
    <FormField
      control={form.control}
      name="productoId"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Seleccionar producto</FormLabel>
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
                    ? producto.find((p) => p.id === field.value)?.nombre
                    : "Seleccionar producto..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onValueChange={handleInputChange}
                />
                <CommandList>
                  <CommandEmpty>No se encontraron productos.</CommandEmpty>
                  <CommandGroup heading="Productos">
                    {filteredProducts.map((p) => (
                      <CommandItem
                        key={p.id}
                        onSelect={() => handleSelectProduct(p)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            p.id === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {p.nombre}
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
