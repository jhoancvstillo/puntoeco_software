import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Cliente } from '@/types/client';

interface ClienteTableProps {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: number) => void;
  onViewDetails: (cliente: Cliente) => void;
}

export const ClienteTable: React.FC<ClienteTableProps> = ({ clientes, onEdit, onDelete, onViewDetails }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead className="">Dirección</TableHead>
          <TableHead className="">RUT</TableHead>
          <TableHead className="text-center pl-6">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientes && clientes.length > 0 ? (
          clientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell>{cliente.name}</TableCell>
              <TableCell>{cliente.mail}</TableCell>
              <TableCell>{cliente.phoneNumber}</TableCell>
              <TableCell className="">{cliente.address}</TableCell>
              <TableCell className="">{cliente.rut}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onViewDetails(cliente)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(cliente)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(cliente.id!)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              No hay clientes para mostrar.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

