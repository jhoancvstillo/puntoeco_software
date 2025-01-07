import React, { useState } from "react";
import { createProducto, deleteProducto, updateEntity } from "@/api/productos"; // Ajusta si los métodos están en un archivo agrupado
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Producto, Categoria, Marca, Modelo } from "../types/inventory";

interface ProductManagerProps {
  productos: Producto[];
  categorias: Categoria[];
  marcas: Marca[];
  modelos: Modelo[];
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
}

export interface ProductManagerFormProps {
  nombre: string;
  categoria: number;
  marca: number;
  modelo: number;
  precio_por_unidad: string;
  stocks: {
    id: number;
    ubicacion: string;
    cantidad: number;
    stock_minimo: number;
  }[];
}


interface ProductManagerProps {
  productos: Producto[];
  categorias: Categoria[];
  marcas: Marca[];
  modelos: Modelo[];
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
}
export function ProductManager({
  productos,
  categorias,
  marcas,
  modelos,
  setProductos,
}: ProductManagerProps) {
  const [newProducto, setNewProducto] = useState<ProductManagerFormProps>({
    nombre: "",
    categoria: 0,
    marca: 0,
    modelo: 0,
    precio_por_unidad: "",
    stocks: [{ id: 0, ubicacion: "", cantidad: 0, stock_minimo: 0 }],
  });

  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [originalProducto, setOriginalProducto] = useState<Producto | null>(
    null
  );


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
        modelo: 0,
        precio_por_unidad: "",
        stocks: [{ id: 0, ubicacion: "", cantidad: 0, stock_minimo: 0 }],
      });
    } catch (error) {
      console.error("Error creating producto:", error);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  //                           ACTUALIZAR PRODUCTO / STOCK
  // ─────────────────────────────────────────────────────────────────────────────
  const handleUpdateProducto = async () => {
    if (editingProducto && originalProducto) {
      const productChanges: any = {};
      const stockChanges: any = {};

      // Detectar cambios en los campos de Producto
      if (editingProducto.nombre !== originalProducto.nombre) {
        productChanges.nombre = editingProducto.nombre;
      }
      if (
        editingProducto.precio_por_unidad !== originalProducto.precio_por_unidad
      ) {
        productChanges.precio_por_unidad = editingProducto.precio_por_unidad;
      }
      if (editingProducto.categoria.id !== originalProducto.categoria.id) {
        productChanges.categoria = editingProducto.categoria.id;
      }
      if (editingProducto.marca.id !== originalProducto.marca.id) {
        productChanges.marca = editingProducto.marca.id;
      }
      if (
        editingProducto.modelo &&
        originalProducto.modelo &&
        editingProducto.modelo.id !== originalProducto.modelo.id
      ) {
        productChanges.modelo = editingProducto.modelo.id;
      }

      // Detectar cambios en el stock
      const stock = editingProducto.stocks[0];
      const originalStock = originalProducto.stocks[0];

      if (stock.cantidad !== originalStock.cantidad) {
        stockChanges.cantidad = stock.cantidad;
      }
      if (stock.ubicacion !== originalStock.ubicacion) {
        stockChanges.ubicacion = stock.ubicacion;
      }
      if (stock.stock_minimo !== originalStock.stock_minimo) {
        stockChanges.stock_minimo = stock.stock_minimo;
      }

      // Actualizar producto y/o stock según los cambios detectados
      try {
        if (Object.keys(productChanges).length > 0) {
          await updateEntity(editingProducto.id, productChanges);
        }

        if (Object.keys(stockChanges).length > 0) {
          const stockId = stock.id;
          if (stockId) {
            await updateEntity(stockId, stockChanges);
          }
        }

        // Actualizar estado local
        setProductos((prev) =>
          prev.map((p) =>
            p.id === editingProducto.id ? { ...editingProducto } : p
          )
        );

        // Limpiar estados
        setEditingProducto(null);
        setOriginalProducto(null);
      } catch (error) {
        console.error("Error updating producto/stock:", error);
      }
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  //                           ELIMINAR PRODUCTO
  // ─────────────────────────────────────────────────────────────────────────────
  const handleDeleteProducto = async (id: number) => {
    try {
      await deleteProducto(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting producto:", error);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────────
  //                               RENDER
  // ─────────────────────────────────────────────────────────────────────────────
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

            {/* MODELO */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modelo" className="text-right">
                Modelo
              </Label>
              <Select
                onValueChange={(value) =>
                  setNewProducto({
                    ...newProducto,
                    modelo:
                      modelos.find((m) => m.id.toString() === value)?.id || 0,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar modelo" />
                </SelectTrigger>
                <SelectContent>
                  {modelos.map((modelo) => (
                    <SelectItem key={modelo.id} value={modelo.id.toString()}>
                      {modelo.nombre}
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

      {/** ─────────────────────────────────────────────────────────────────────
           TABLA DE PRODUCTOS
          ───────────────────────────────────────────────────────────────────── */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((producto) => (
            <TableRow key={producto.id}>
              <TableCell>{producto.nombre}</TableCell>
              <TableCell>{producto.categoria.nombre}</TableCell>
              <TableCell>{producto.marca.nombre}</TableCell>
              <TableCell>
                {producto.modelo ? producto.modelo.nombre : ""}
              </TableCell>
              <TableCell>${producto.precio_por_unidad}</TableCell>
              <TableCell>
                {producto.stocks.length > 0
                  ? producto.stocks[0].cantidad
                  : "Sin stock"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingProducto(producto);
                        setOriginalProducto(producto);
                      }}
                    >
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteProducto(producto.id)}
                    >
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/** ─────────────────────────────────────────────────────────────────────
           DIALOGO PARA EDITAR PRODUCTO
          ───────────────────────────────────────────────────────────────────── */}
      {editingProducto && (
        <Dialog
          open={!!editingProducto}
          onOpenChange={() => {
            setEditingProducto(null);
            setOriginalProducto(null);
          }}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Editar Producto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* NOMBRE */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-nombre"
                  value={editingProducto.nombre}
                  onChange={(e) =>
                    setEditingProducto({
                      ...editingProducto,
                      nombre: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>

              {/* CATEGORÍA */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-categoria" className="text-right">
                  Categoría
                </Label>
                <Select
                  onValueChange={(value) =>
                    setEditingProducto({
                      ...editingProducto,
                      categoria: {
                        id: parseInt(value),
                        nombre:
                          categorias.find((c) => c.id === parseInt(value))
                            ?.nombre || "",
                        descripcion:
                          categorias.find((c) => c.id === parseInt(value))
                            ?.descripcion || "",
                      },
                    })
                  }
                  value={editingProducto.categoria?.id?.toString() || ""}
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
                <Label htmlFor="edit-marca" className="text-right">
                  Marca
                </Label>
                <Select
                  onValueChange={(value) =>
                    setEditingProducto({
                      ...editingProducto,
                      marca: {
                        id: parseInt(value),
                        nombre:
                          marcas.find((m) => m.id === parseInt(value))
                            ?.nombre || "",
                        descripcion:
                          marcas.find((m) => m.id === parseInt(value))
                            ?.descripcion || "",
                      },
                    })
                  }
                  value={editingProducto.marca?.id?.toString() || ""}
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

              {/* MODELO */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-modelo" className="text-right">
                  Modelo
                </Label>
                <Select
                  onValueChange={(value) =>
                    setEditingProducto({
                      ...editingProducto,
                      modelo: {
                        id: parseInt(value),
                        nombre:
                          modelos.find((m) => m.id === parseInt(value))
                            ?.nombre || "",
                        descripcion:
                          modelos.find((m) => m.id === parseInt(value))
                            ?.descripcion || "",
                        marca: modelos.find((m) => m.id === parseInt(value))
                          ?.marca || { id: 0, nombre: "", descripcion: "" },
                      },
                    })
                  }
                  value={editingProducto.modelo?.id?.toString() || ""}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelos.map((modelo) => (
                      <SelectItem key={modelo.id} value={modelo.id.toString()}>
                        {modelo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* PRECIO */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-precio" className="text-right">
                  Precio por unidad
                </Label>
                <Input
                  id="edit-precio"
                  type="number"
                  value={editingProducto.precio_por_unidad}
                  onChange={(e) =>
                    setEditingProducto({
                      ...editingProducto,
                      precio_por_unidad: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>

              {/* UBICACIÓN */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-ubicacion" className="text-right">
                  Ubicación
                </Label>
                <Input
                  id="edit-ubicacion"
                  value={editingProducto.stocks[0].ubicacion || ""}
                  onChange={(e) =>
                    setEditingProducto({
                      ...editingProducto,
                      stocks: [
                        {
                          ...editingProducto.stocks[0],
                          ubicacion: e.target.value,
                        },
                      ],
                    })
                  }
                  className="col-span-3"
                />
              </div>

              {/* CANTIDAD */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-cantidad" className="text-right">
                  Cantidad
                </Label>
                <Input
                  id="edit-cantidad"
                  type="number"
                  value={editingProducto.stocks[0].cantidad}
                  onChange={(e) =>
                    setEditingProducto({
                      ...editingProducto,
                      stocks: [
                        {
                          ...editingProducto.stocks[0],
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
                <Label htmlFor="edit-stock_minimo" className="text-right">
                  Stock Mínimo
                </Label>
                <Input
                  id="edit-stock_minimo"
                  type="number"
                  value={editingProducto.stocks[0].stock_minimo}
                  onChange={(e) =>
                    setEditingProducto({
                      ...editingProducto,
                      stocks: [
                        {
                          ...editingProducto.stocks[0],
                          stock_minimo: parseInt(e.target.value) || 0,
                        },
                      ],
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleUpdateProducto}>Actualizar Producto</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
