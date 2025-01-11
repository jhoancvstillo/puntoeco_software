import { useState } from "react";
import { createProducto, deleteProducto } from "@/api/productos"; // Ajusta si los métodos están en un archivo agrupado
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductManagerFormProps, ProductManagerProps } from "./types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GenericTable from "@/components/GenericTable";

export function ProductManager({
  productos,
  categorias,
  marcas,
  setProductos,
}: ProductManagerProps) {
  const [newProducto, setNewProducto] = useState<ProductManagerFormProps>({
    nombre: "",
    categoria: 0,
    marca: 0,
    precio_por_unidad: "",
    stocks: [{ id: 0, ubicacion: "", cantidad: 0, stock_minimo: 0 }],
  });

  // ─────────────────────────────────────────────────────────────────────────────
  //                            CREAR PRODUCTO
  // ─────────────────────────────────────────────────────────────────────────────
  const handleCreateProducto = async () => {
    try {
      const createdProducto = await createProducto(newProducto);
      setProductos((prev) => [...prev, createdProducto]);

      // Reset form
      setNewProducto({
        nombre: "",
        categoria: 0,
        marca: 0,
        precio_por_unidad: "",
        stocks: [{ id: 0, ubicacion: "", cantidad: 0, stock_minimo: 0 }],
      });
    } catch (error) {
      console.error("Error creating producto:", error);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  //                           ELIMINAR PRODUCTO
  // ─────────────────────────────────────────────────────────────────────────────
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
      {/** ─────────────────────────────────────────────────────────────────────
           DIALOGO PARA CREAR PRODUCTO
          ───────────────────────────────────────────────────────────────────── */}
      <Dialog>
        <DialogTrigger asChild>
          <Button>Agregar Producto</Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Producto</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* NOMBRE */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={newProducto.nombre}
                onChange={(e) =>
                  setNewProducto({ ...newProducto, nombre: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            {/* CATEGORÍA */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoria" className="text-right">
                Categoría
              </Label>
              <Select
                onValueChange={(value) =>
                  setNewProducto({
                    ...newProducto,
                    categoria:
                      categorias.find((c) => c.id.toString() === value)?.id ||
                      0,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem
                      key={categoria.id}
                      value={categoria.id.toString()}
                    >
                      {categoria.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* MARCA */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="marca" className="text-right">
                Marca
              </Label>
              <Select
                onValueChange={(value) =>
                  setNewProducto({
                    ...newProducto,
                    marca:
                      marcas.find((m) => m.id.toString() === value)?.id || 0,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar marca" />
                </SelectTrigger>
                <SelectContent>
                  {marcas.map((marca) => (
                    <SelectItem key={marca.id} value={marca.id.toString()}>
                      {marca.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* PRECIO */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="precio" className="text-right">
                Precio por unidad
              </Label>
              <Input
                id="precio"
                type="number"
                value={newProducto.precio_por_unidad}
                onChange={(e) =>
                  setNewProducto({
                    ...newProducto,
                    precio_por_unidad: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>

            {/* UBICACIÓN */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ubicacion" className="text-right">
                Ubicación
              </Label>
              <Input
                id="ubicacion"
                value={newProducto.stocks[0].ubicacion || ""}
                onChange={(e) =>
                  setNewProducto({
                    ...newProducto,
                    stocks: [
                      { ...newProducto.stocks[0], ubicacion: e.target.value },
                    ],
                  })
                }
                className="col-span-3"
              />
            </div>

            {/* CANTIDAD */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cantidad" className="text-right">
                Cantidad
              </Label>
              <Input
                id="cantidad"
                type="number"
                value={newProducto.stocks[0].cantidad}
                onChange={(e) =>
                  setNewProducto({
                    ...newProducto,
                    stocks: [
                      {
                        ...newProducto.stocks[0],
                        cantidad: parseInt(e.target.value) || 0,
                      },
                    ],
                  })
                }
                className="col-span-3"
              />
            </div>

            {/* STOCK MÍNIMO */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock_minimo" className="text-right">
                Stock Mínimo
              </Label>
              <Input
                id="stock_minimo"
                type="number"
                value={newProducto.stocks[0].stock_minimo}
                onChange={(e) =>
                  setNewProducto({
                    ...newProducto,
                    stocks: [
                      {
                        ...newProducto.stocks[0],
                        stock_minimo: parseInt(e.target.value) || 0,
                      },
                    ],
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleCreateProducto}>Guardar Producto</Button>
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
