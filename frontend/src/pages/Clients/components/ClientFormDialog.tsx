import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ClienteForm } from './ClientForm';
import { Cliente } from '@/types/client';

interface ClientFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: Cliente) => void;
  initialData?: Cliente | null;
}

export const ClientFormDialog: React.FC<ClientFormDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {/* <Button onClick={() => onOpenChange(true)}>
          {initialData ? 'Editar Cliente' : 'Agregar Cliente'}
        </Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Cliente' : 'Agregar Cliente'}</DialogTitle>
          <DialogDescription>
            Complete los detalles del cliente aquí. Haga clic en guardar cuando termine.
          </DialogDescription>
        </DialogHeader>
        <ClienteForm onSubmit={onSubmit} initialData={initialData} />
      </DialogContent>
    </Dialog>
  );
};
