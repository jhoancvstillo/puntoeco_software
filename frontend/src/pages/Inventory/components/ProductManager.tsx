import { createProducto, deleteProducto } from "@/api/productos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductManagerProps } from "./types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import GenericTable from "@/components/GenericTable";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductSchemaType } from "./productSchema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export function ProductManager({
  productos,
  categorias,
  marcas,
  setProductos,
}: ProductManagerProps) {
  const form = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nombre: "",
      categoria: 0,
      marca: 0,
      precio_por_unidad: "",
      stocks: [{ id: 0, ubicacion: "", cantidad: 0, stock_minimo: 0 }],
    },
  });

  const handleCreateProducto = async (data: ProductSchemaType) => {
    try {
      const createdProducto = await createProducto(data);
      setProductos((prev) => [...prev, createdProducto]);
      form.reset();
    } catch (error) {
      console.error("Error creating producto:", error);
    }
  };

  const handleDeleteProducto = async (record: { id: number }) => {
    try {
      await deleteProducto(record.id);
      setProductos((prev) => prev.filter((p) => p.id !== record.id));
    } catch (error) {
      console.error("Error deleting producto:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Agregar Producto</Button>
        </DialogTrigger>
        <DialogContent className="max-w-xl ">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Producto</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] w-full rounded-md border p-2">

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateProducto)} className="space-y-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categorias.map((categoria) => (
                          <SelectItem key={categoria.id} value={categoria.id.toString()}>
                            {categoria.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar marca" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {marcas.map((marca) => (
                          <SelectItem key={marca.id} value={marca.id.toString()}>
                            {marca.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="precio_por_unidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio por unidad</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stocks.0.ubicacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stocks.0.cantidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stocks.0.stock_minimo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Mínimo</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Guardar Producto</Button>
            </form>
          </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <GenericTable
        initialRecords={productos.map((p) => ({
          ...p,
          marca: p.marca.nombre,
          categoria: p.categoria.nombre,
          stocks: p.stocks.reduce((acc, stock) => acc + stock.cantidad, 0),
          ubicacion: p.stocks.map((stock) => stock.ubicacion).join(", "),
        }))}
        columns={[
          { key: "nombre", header: "Nombre" },
          { key: "categoria", header: "Categoría" },
          { key: "marca", header: "Marca" },
          { key: "precio_por_unidad", header: "Precio por Unidad" },
          { key: "stocks", header: "Stocks" },
          { key: "ubicacion", header: "Ubicación" },
        ]}
        title="Tabla General"
        description="Descripción de la tabla general"
        onDelete={handleDeleteProducto}
      />
    </div>
  );
}

