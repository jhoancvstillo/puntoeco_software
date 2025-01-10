// /components/inventory/InventoryTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Producto } from "../types/inventory";

interface InventoryTableProps {
  productos: Producto[];
}

const InventoryTable: React.FC<InventoryTableProps> = ({ productos }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Marca</TableHead>
          <TableHead>Ubicación</TableHead>
          <TableHead>Precio por Unidad</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productos.map((prod) => (
          <TableRow key={prod.id}>
            <TableCell>{prod.nombre}</TableCell>
            <TableCell>{prod.categoria.nombre}</TableCell>
            <TableCell>{prod.marca.nombre}</TableCell>
            <TableCell>
              {prod.stocks.map((stock) => stock.ubicacion).join(", ")}
            </TableCell>
            <TableCell>
              ${parseFloat(prod.precio_por_unidad).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InventoryTable;
