import React, { useState } from 'react';
import { createModelo, updateModelo, deleteModelo } from '@/api/productos';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from 'lucide-react'
import { Modelo, Marca } from '../types/inventory'

interface ModelManagerProps {
  modelos: Modelo[];
  setModelos: React.Dispatch<React.SetStateAction<Modelo[]>>;
  marcas: Marca[];
}


export function ModelManager({ modelos, setModelos, marcas }: ModelManagerProps) {
  // marca debe ser un objeto con id, nombre y descripcion
  const [newModelo, setNewModelo] = useState<{ nombre: string; descripcion: string; marca: number }>({
    nombre: '',
    descripcion: '',
    marca: 0,
  });


  const [editingModelo, setEditingModelo] = useState<Modelo | null>(null);



  const handleCreateModelo = async () => {
    try {
    console.log(newModelo);
      
    const createdModelo = await createModelo(newModelo);
      setModelos(prevModelos => [...prevModelos, createdModelo]);
      setNewModelo({ nombre: '', descripcion: '', marca: 0});
    } catch (error) {
      console.error('Error creating modelo:', error);
    }
  };

  const handleUpdateModelo = async () => {
    if (editingModelo) {
      try {
        const updatedModelo = await updateModelo(editingModelo.id, editingModelo);
        setModelos(prevModelos => prevModelos.map(m => m.id === updatedModelo.id ? updatedModelo : m));
        setEditingModelo(null);
      } catch (error) {
        console.error('Error updating modelo:', error);
      }
    }
  };

  const handleDeleteModelo = async (id: number) => {
    try {
      await deleteModelo(id);
      setModelos(prevModelos => prevModelos.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting modelo:', error);
    }
  };

  return (
    <div className="">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Agregar Modelo</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Modelo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={newModelo.nombre}
                onChange={(e) => setNewModelo({ ...newModelo, nombre: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion" className="text-right">
                Descripción
              </Label>
              <Input
                id="descripcion"
                value={newModelo.descripcion}
                onChange={(e) => setNewModelo({ ...newModelo, descripcion: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="marca" className="text-right">
                Marca
              </Label>
              <Select onValueChange={(value) => setNewModelo({ ...newModelo, marca: newModelo.marca = parseInt(value) })} value={newModelo.marca.toString()}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar marca" />
                </SelectTrigger>
                <SelectContent>
                  {marcas.map((marca) => (
                    <SelectItem key={marca.id} value={marca.id.toString()}>
                      {marca.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleCreateModelo}>Guardar Modelo</Button>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {modelos.map((modelo) => (
            <TableRow key={modelo.id}>
              <TableCell>{modelo.nombre}</TableCell>
              <TableCell>{modelo.descripcion}</TableCell>
              <TableCell>{modelo.marca.nombre}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingModelo(modelo)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteModelo(modelo.id)}>
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingModelo && (
        <Dialog open={!!editingModelo} onOpenChange={() => setEditingModelo(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Modelo</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-nombre"
                  value={editingModelo.nombre}
                  onChange={(e) => setEditingModelo({ ...editingModelo, nombre: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-descripcion" className="text-right">
                  Descripción
                </Label>
                <Input
                  id="edit-descripcion"
                  value={editingModelo.descripcion}
                  onChange={(e) => setEditingModelo({ ...editingModelo, descripcion: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-marca" className="text-right">
                  Marca
                </Label>
                <Select 
                  onValueChange={(value) => setEditingModelo({ ...editingModelo, marca: { id: parseInt(value), nombre: marcas.find(m => m.id === parseInt(value))?.nombre || '', descripcion: marcas.find(m => m.id === parseInt(value))?.descripcion || '' } })}
                  value={editingModelo.marca.id.toString()}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {marcas.map((marca) => (
                      <SelectItem key={marca.id} value={marca.id.toString()}>
                        {marca.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleUpdateModelo}>Actualizar Modelo</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

