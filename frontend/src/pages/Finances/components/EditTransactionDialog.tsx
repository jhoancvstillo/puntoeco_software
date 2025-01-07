import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransactionForm } from './TransactionForm';
import { Transaction, Classification, Subcategory } from "@/types/finance";

interface EditTransactionDialogProps {
  transaction: Transaction | null;
  onClose: () => void;
  onUpdate: (updatedTransaction: Transaction) => void;
  classifications: Classification[];
  subcategories: Subcategory[];
}

export const EditTransactionDialog: React.FC<EditTransactionDialogProps> = ({
  transaction,
  onClose,
  onUpdate,
  classifications,
  subcategories,
}) => {
  if (!transaction) return null;

  return (
    <Dialog open={!!transaction} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Transacción</DialogTitle>
        </DialogHeader>
        <TransactionForm
          initialData={transaction}
          onSubmit={(data) => {
            if (data) {
              onUpdate({ ...transaction, ...data });
            }
            onClose();
          }}
          classifications={classifications}
          subcategories={subcategories}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
