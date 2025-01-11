import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddUserForm } from "./AddUserForm";
import { User } from "@/types/user";

export function AddUserDialog({
  isAddUserOpen,
  setIsAddUserOpen,
  handleOnAddUser,
}: {
  isAddUserOpen: boolean;
  setIsAddUserOpen: (open: boolean) => void;
  handleOnAddUser: (user: Omit<User, "id">) => void;
}) {
  return (
    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
        </DialogHeader>
        <AddUserForm onSubmit={handleOnAddUser} />
      </DialogContent>
    </Dialog>
  );
}
