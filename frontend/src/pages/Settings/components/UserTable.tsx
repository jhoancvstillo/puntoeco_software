import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from 'lucide-react'
import { User } from "@/types/user"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DeleteConfirmationDialog } from "./deleteDialog"

export function UserTable({
  users,
  setEditingUser,
  setIsEditUserOpen,
  handleOnDelete,
}: {
  users: User[]
  setEditingUser: (user: User) => void
  setIsEditUserOpen: (isOpen: boolean) => void
  handleOnDelete: (id: number, currentUser: User) => void
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      handleOnDelete(userToDelete.id, userToDelete)
      closeDeleteDialog()
    }
  }

  return (
    <>
      <Table>
        <ScrollArea className="h-[250px]">
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  {user.role === "admin" ? "Administrador" : "Usuario"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingUser(user)
                        setIsEditUserOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </ScrollArea>
      </Table>
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        itemName={userToDelete?.username || ""}
      />
    </>
  )
}

