import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { User } from "@/types/user";
import { UpdateUserForm } from "./UpdateUserForm";


export function EditUserDialog({
  isEditUserOpen,
  setIsEditUserOpen,
  editingUser,
  handleOnUpdateUser,
}: {
  isEditUserOpen: boolean;
  setIsEditUserOpen: (open: boolean) => void;
  editingUser: User | null;
  handleOnUpdateUser: (updatedUser: Partial<User>) => void;
}) {
  return (
    <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar Usuario</DialogTitle>
        </DialogHeader>
        {editingUser && (
          <UpdateUserForm user={editingUser} onSubmit={handleOnUpdateUser} />
        )}
      </DialogContent>
    </Dialog>
  );
}
