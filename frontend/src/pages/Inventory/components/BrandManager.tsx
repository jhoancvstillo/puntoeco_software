import React, { useState } from 'react';
import { createMarca, updateMarca, deleteMarca } from '@/api/productos';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from 'lucide-react'
import { Marca } from '../types/inventory'

interface BrandManagerProps {
  marcas: Marca[];
  setMarcas: React.Dispatch<React.SetStateAction<Marca[]>>;
}

export function BrandManager({ marcas, setMarcas }: BrandManagerProps) {
  const [newMarca, setNewMarca] = useState({ nombre: '', descripcion: '' });
  const [editingMarca, setEditingMarca] = useState<Marca | null>(null);

  const handleCreateMarca = async () => {
    try {
      const createdMarca = await createMarca(newMarca);
      setMarcas(prevMarcas => [...prevMarcas, createdMarca]);
      setNewMarca({ nombre: '', descripcion: '' });
    } catch (error) {
      console.error('Error creating marca:', error);
    }
  };

  const handleUpdateMarca = async () => {
    if (editingMarca) {
      try {
        const updatedMarca = await updateMarca(editingMarca.id, editingMarca);
        setMarcas(prevMarcas => prevMarcas.map(m => m.id === updatedMarca.id ? updatedMarca : m));
        setEditingMarca(null);
      } catch (error) {
        console.error('Error updating marca:', error);
      }
    }
  };

  const handleDeleteMarca = async (id: number) => {
    try {
      await deleteMarca(id);
      setMarcas(prevMarcas => prevMarcas.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting marca:', error);
    }
  };

  return (
    <div className="space-y-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Agregar Marca</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nueva Marca</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={newMarca.nombre}
                onChange={(e) => setNewMarca({ ...newMarca, nombre: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion" className="text-right">
                Descripción
              </Label>
              <Input
                id="descripcion"
                value={newMarca.descripcion}
                onChange={(e) => setNewMarca({ ...newMarca, descripcion: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleCreateMarca}>Guardar Marca</Button>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {marcas.map((marca) => (
            <TableRow key={marca.id}>
              <TableCell>{marca.nombre}</TableCell>
              <TableCell>{marca.descripcion}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingMarca(marca)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteMarca(marca.id)}>
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingMarca && (
        <Dialog open={!!editingMarca} onOpenChange={() => setEditingMarca(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Marca</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-nombre"
                  value={editingMarca.nombre}
                  onChange={(e) => setEditingMarca({ ...editingMarca, nombre: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-descripcion" className="text-right">
                  Descripción
                </Label>
                <Input
                  id="edit-descripcion"
                  value={editingMarca.descripcion}
                  onChange={(e) => setEditingMarca({ ...editingMarca, descripcion: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleUpdateMarca}>Actualizar Marca</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

