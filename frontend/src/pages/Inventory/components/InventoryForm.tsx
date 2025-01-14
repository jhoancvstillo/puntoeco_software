import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { InventoryFormProps, InventoryFormSchema } from "./InventorySchema";
import { PlusCircle, MinusCircle } from "lucide-react";
import { useEffect } from "react";
import { getProductos, moveStock } from "@/api/productos";
import { ProductSelect } from "./ProductSelect";

interface InventoryProps {
  onChange: (value: boolean) => void;
  onClick: () => void;
}
export default function InventoryForm({ onChange, onClick}: InventoryProps) {
  const form = useForm<InventoryFormProps>({
    resolver: zodResolver(InventoryFormSchema),
    defaultValues: {
      productoId: 0,
      tipo: "add",
      cantidad: 0,
      observacion: "",
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await getProductos();
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  const onSubmit = async (data: InventoryFormProps) => {
    try {
      await moveStock(data);
      form.reset();
      onChange(false);
    }
    catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Gestión de Inventario
        </CardTitle>
        <CardDescription>
          Añada o retire productos del inventario. Por favor, complete todos los
          campos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="productoId"
                render={() => (
                  <ProductSelect
                    form={form}
                    onSelect={(producto) => {
                      form.setValue("productoId", producto.id); // Asignamos el id seleccionado
                    }}
                  />
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de transacción</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="add">
                            <div className="flex items-center">
                              <PlusCircle className="mr-2 h-4 w-4" />
                              <span>Añadir Stock</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="remove">
                            <div className="flex items-center">
                              <MinusCircle className="mr-2 h-4 w-4" />
                              <span>Descontar Stock</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cantidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Ej: 10" {...field}  
                        // transofrmamos el valor a entero teniendo cuidado del NaN unicamente cuando se termina de escribir, si no hay nada escrito entonces 0
                        onChange={(e: { target: { value: any; }; }) => {
                          const value = e.target.value;
                          if (value === "") {
                            form.setValue("cantidad", 0);
                          } else {
                            form.setValue("cantidad", parseInt(value));
                          }
                        }}
                        

                        
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="observacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observación</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Añada cualquier nota o comentario relevante"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
          type="submit"
          className="w-full"
          onClick={onClick}
        >
          Actualizar Inventario
        </Button>
          </form>
        </Form>
      </CardContent>
       
    </Card>
  );
}
