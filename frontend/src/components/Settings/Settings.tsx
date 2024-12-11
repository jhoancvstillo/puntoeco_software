"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Edit } from "lucide-react";

import type { User, SettingsPopupProps } from "./types/User";
import { TabsContentWrapper } from "./components/TabsContentWrapper";
import { CardSection } from "../CardSection";
import PasswordForm from "./components/PasswordForm";

export function SettingsPopup({ open, onOpenChange }: SettingsPopupProps) {
  const [users, setUsers] = useState<User[]>([
    { id: 1, username: "admin", role: "Administrador" },
    { id: 2, username: "chef", role: "Chef" },
    { id: 3, username: "mesero", role: "Mesero" },
  ]);

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.password !== newUser.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setUsers([
      ...users,
      { id: users.length + 1, username: newUser.username, role: newUser.role },
    ]);
    setNewUser({ username: "", password: "", confirmPassword: "", role: "" });
    setIsAddUserOpen(false);
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const updatedUser: User = {
        id: editingUser.id,
        username: editingUser.username,
        role: editingUser.role,
      };
      if (editingUser.password) {
        updatedUser.password = editingUser.password;
      }
      setUsers(
        users.map((user) => (user.id === editingUser.id ? updatedUser : user))
      );
      setEditingUser(null);
      setIsEditUserOpen(false);
    }
  };

  const AddUserDialog = () => (
    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input
              id="username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Validar contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={newUser.confirmPassword}
              onChange={(e) =>
                setNewUser({ ...newUser, confirmPassword: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Input
              id="role"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddUserOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar Usuario</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  const EditUserDialog = () => (
    <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>
        {editingUser && (
          <form onSubmit={handleEditUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-username">Nombre de usuario</Label>
              <Input
                id="edit-username"
                value={editingUser.username}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, username: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Rol</Label>
              <Input
                id="edit-role"
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">
                Nueva Contraseña (dejar en blanco para no cambiar)
              </Label>
              <Input
                id="edit-password"
                type="password"
                onChange={(e) =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, password: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditUserOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar Cambios</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Configuración</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="general" className="w-full">
          <TabsContentWrapper>
            <TabsContent value="general">
              <CardSection
                title="Configuración General"
                description="Ajusta la configuración general de la aplicación."
              >
                <p>Opciones de configuración general...</p>
              </CardSection>
            </TabsContent>
            <TabsContent value="users">
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
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingUser(user);
                                    setIsEditUserOpen(true);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <Button
                        className="mt-4"
                        onClick={() => setIsAddUserOpen(true)}
                      >
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
                </CardSection>
            </TabsContent>
            <TabsContent value="security">
              <CardSection
                title="Cambiar Contraseña"
                description="Cambia tu contraseña aquí. Después de guardar, serás desconectado."
              >
            
                <PasswordForm />
              </CardSection>
            </TabsContent>
          </TabsContentWrapper>
        </Tabs>
      </DialogContent>
      <AddUserDialog />
      <EditUserDialog />
    </Dialog>
  );
}
