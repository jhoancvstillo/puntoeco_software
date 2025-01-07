"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

import type { User } from "@/types/user";
import { CardSection } from "@/components/CardSection";
import {
  createUser,
  deleteUser,
  get_current_user,
  getUsers,
  updateUser,
} from "@/api/users";
import { AddUserForm } from "./AddUserForm";
import { UpdateUserForm } from "./UpdateUserForm";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [currentUserData, usersListData] = await Promise.all([
          get_current_user(),
          getUsers(),
        ]);
        console.log("currentUserData", currentUserData);
        setUsers(usersListData);
        setCurrentUser(currentUserData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchData();
  }, []);

  const handleOnDelete = (id: number) => {
    const currentUserId = currentUser?.id; // Reemplaza con la forma real de obtener el ID del usuario autenticado
    if (id === currentUserId) {
      alert("No puedes eliminar tu propio usuario.");
      return;
    }
    deleteUser(id);
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  const handleOnAddUser = async (user: Omit<User, "id">) => {
    try {
      const newUser = await createUser(user);
      setUsers((prevUsers) => [...prevUsers, newUser]);

      setIsAddUserOpen(false);
    } catch (error) {
      console.error("Error creating user:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleOnUpdateUser = async (updatedUser: Partial<User>) => {
    console.log("updatedUser", updatedUser);
    if (!editingUser) return;
    try {
      const updated = await updateUser({ ...editingUser, ...updatedUser });
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updated.id ? updated : user))
      );
      setIsEditUserOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <CardSection
      title="Usuarios"
      description="Administra los usuarios de la aplicación."
    >
      {users.length > 0 ? (
        <>
          <Table>
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
                  <TableCell>{user.role}</TableCell>
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
                      onClick={() => handleOnDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button className="mt-4" onClick={() => setIsAddUserOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Usuario
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-40">
          <p className="text-muted-foreground mb-4">
            No hay usuarios registrados
          </p>
          <Button onClick={() => setIsAddUserOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Usuario
          </Button>
        </div>
      )}

      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
          </DialogHeader>
          <AddUserForm onSubmit={handleOnAddUser} />
        </DialogContent>
      </Dialog>

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


    </CardSection>
    
  );
}
