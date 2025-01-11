import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { TransactionForm } from "./TransactionForm";

    import { Classification, Subcategory } from "@/types/finance"
export function AddTransactionDialog({
    isDialogOpen,
    setIsDialogOpen,
    handleTransactionSubmit,
    classifications,
    subcategories,
  }: {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    handleTransactionSubmit: () => void;
    classifications: Classification[];
    subcategories: Subcategory[];
  }) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nueva Transacción</DialogTitle>
          </DialogHeader>
          <TransactionForm
            onSubmit={handleTransactionSubmit}
            classifications={classifications}
            subcategories={subcategories}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }
  