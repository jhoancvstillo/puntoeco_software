import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { Edit, Trash2 } from "lucide-react";

import { User } from "@/types/user";
import { ScrollArea } from "@/components/ui/scroll-area";

export function UserTable({
  users,
  setEditingUser,
  setIsEditUserOpen,
  handleOnDelete,
}: {
  users: User[];
  setEditingUser: (user: User) => void;
  setIsEditUserOpen: (isOpen: boolean) => void;
  handleOnDelete: (id: number, currentUser: User) => void;
  
  
  
}) {
  return (
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
                    setEditingUser(user);
                    setIsEditUserOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOnDelete(user.id, user)}
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
  );
}
