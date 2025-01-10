import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { Transaction } from "@/types/finance";
import { formatDateTime } from "@/utils/formatDate";

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: number) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  onDelete,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha y Hora</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Clasificación</TableHead>
          <TableHead>Subcategoría</TableHead>
          <TableHead>Comentario</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{formatDateTime(transaction.date_time)}</TableCell>
            <TableCell>{transaction.transaction_type === 'Expense' ? 'Gasto' : 'Ingreso'}</TableCell>
            <TableCell>{transaction.classification.name}</TableCell>
            <TableCell>{transaction.subcategory.name}</TableCell>
            <TableCell>{transaction.comment}</TableCell>
            <TableCell>${parseFloat(transaction.price).toFixed(2)}</TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" onClick={() => onDelete(transaction.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

