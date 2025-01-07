// /components/inventory/InventoryDialog.tsx
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DialogMode = "add" | "edit" | "delete" | null;

interface InventoryDialogProps {
  open: boolean;
  mode: DialogMode;
  onClose: () => void;
}


const InventoryDialog: React.FC<InventoryDialogProps> = ({
  open,
  mode,
  onClose,
}) => {

    const handleOpenChange = () => onClose();

  return (
<Dialog open={open} onOpenChange={handleOpenChange}>
<DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>
            {mode === "add"
              ? "Agregar Nuevo Producto"
              : mode === "edit"
              ? "Editar Producto"
              : mode === "delete"
              ? "Eliminar Producto"
              : "Sin acción"}
          </DialogTitle>
        </DialogHeader>

        {mode === "add" && (
          <p>Aquí iría el formulario para agregar un nuevo producto...</p>
        )}

        {mode === "edit" && (
          <p>Aquí iría el formulario para editar un producto existente...</p>
        )}

        {mode === "delete" && (
          <div>
            <p>¿Estás seguro que deseas eliminar el producto?</p>
            <Button variant="destructive" className="mt-2" onClick={onClose}>
              Eliminar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InventoryDialog;

