"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CardSection } from "@/components/CardSection";
import { useUsers } from "./useUsers";
import { User } from "@/types/user";
import { UserTable } from "./UserTable";
import { AddUserDialog } from "./EditUserDialog";
import { EditUserDialog } from "./AddUserDialog";

export default function Users() {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const {
    users,
    currentUser,
    isLoading,
    error,
    addUser,
    updateUser,
    deleteUser,
  } = useUsers();

  const handleOnDelete = (id: number) => {
    if (id === currentUser?.id) {
      alert("No puedes eliminar tu propio usuario.");
      return;
    }
    deleteUser(id);
  };

  const handleOnAddUser = async (user: Omit<User, "id">) => {
    await addUser(user);
    setIsAddUserOpen(false);
    console.log("User added");
    console.log(user);
  };

  const handleOnUpdateUser = async (updatedUser: Partial<User>) => {
    if (!editingUser) return;
    await updateUser({ ...editingUser, ...updatedUser });
    setIsEditUserOpen(false);
    setEditingUser(null);
  };

  return (
    <CardSection
      title="Usuarios"
      description="Administra los usuarios de la aplicación."
    >
      {isLoading ? (
        <p>Cargando usuarios...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : users.length > 0 ? (
        <>
          <UserTable
            users={users}
            setEditingUser={setEditingUser}
            setIsEditUserOpen={setIsEditUserOpen}
            handleOnDelete={handleOnDelete}
          />
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

      <AddUserDialog
        isAddUserOpen={isAddUserOpen}
        setIsAddUserOpen={setIsAddUserOpen}
        handleOnAddUser={handleOnAddUser}
      />
      <EditUserDialog
        isEditUserOpen={isEditUserOpen}
        setIsEditUserOpen={setIsEditUserOpen}
        editingUser={editingUser}
        handleOnUpdateUser={handleOnUpdateUser}
      />
    </CardSection>
  );
}
