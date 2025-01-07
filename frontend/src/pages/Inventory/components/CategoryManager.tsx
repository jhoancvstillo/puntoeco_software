import React, { useState } from 'react';
import { createCategoria, updateCategoria, deleteCategoria } from '@/api/productos';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from 'lucide-react'
import { Categoria } from '../types/inventory'

interface CategoryManagerProps {
  categorias: Categoria[];
  setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>;
}

export function CategoryManager({ categorias, setCategorias }: CategoryManagerProps) {
  const [newCategoria, setNewCategoria] = useState({ nombre: '', descripcion: '' });
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);

  const handleCreateCategoria = async () => {
    try {
      const createdCategoria = await createCategoria(newCategoria);
      setCategorias(prevCategorias => [...prevCategorias, createdCategoria]);
      setNewCategoria({ nombre: '', descripcion: '' });
    } catch (error) {
      console.error('Error creating categoria:', error);
    }
  };

  const handleUpdateCategoria = async () => {
    if (editingCategoria) {
      try {
        const updatedCategoria = await updateCategoria(editingCategoria.id, editingCategoria);
        setCategorias(prevCategorias => prevCategorias.map(c => c.id === updatedCategoria.id ? updatedCategoria : c));
        setEditingCategoria(null);
      } catch (error) {
        console.error('Error updating categoria:', error);
      }
    }
  };

  const handleDeleteCategoria = async (id: number) => {
    try {
      await deleteCategoria(id);
      setCategorias(prevCategorias => prevCategorias.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting categoria:', error);
    }
  };

  return (
    <div className="space-y-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Agregar Categoría</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nueva Categoría</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={newCategoria.nombre}
                onChange={(e) => setNewCategoria({ ...newCategoria, nombre: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion" className="text-right">
                Descripción
              </Label>
              <Input
                id="descripcion"
                value={newCategoria.descripcion}
                onChange={(e) => setNewCategoria({ ...newCategoria, descripcion: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleCreateCategoria}>Guardar Categoría</Button>
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
          {categorias.map((categoria) => (
            <TableRow key={categoria.id}>
              <TableCell>{categoria.nombre}</TableCell>
              <TableCell>{categoria.descripcion}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingCategoria(categoria)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteCategoria(categoria.id)}>
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingCategoria && (
        <Dialog open={!!editingCategoria} onOpenChange={() => setEditingCategoria(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoría</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-nombre"
                  value={editingCategoria.nombre}
                  onChange={(e) => setEditingCategoria({ ...editingCategoria, nombre: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-descripcion" className="text-right">
                  Descripción
                </Label>
                <Input
                  id="edit-descripcion"
                  value={editingCategoria.descripcion}
                  onChange={(e) => setEditingCategoria({ ...editingCategoria, descripcion: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleUpdateCategoria}>Actualizar Categoría</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

