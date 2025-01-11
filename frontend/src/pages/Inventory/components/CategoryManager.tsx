import React, { useState } from 'react';
import { createCategoria, deleteCategoria } from '@/api/productos';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import GenericTable from '@/components/GenericTable';
import { Categoria } from '../types/inventory';

interface CategoryManagerProps {
  categorias: Categoria[];
  setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>;
}

export function CategoryManager({ categorias, setCategorias }: CategoryManagerProps) {
  const [newCategoria, setNewCategoria] = useState({ nombre: '', descripcion: '' });

  const handleCreateCategoria = async () => {
    try {
      const createdCategoria = await createCategoria(newCategoria);
      setCategorias(prevCategorias => [...prevCategorias, createdCategoria]);
      setNewCategoria({ nombre: '', descripcion: '' });
    } catch (error) {
      console.error('Error creating categoria:', error);
    }
  };


  const handleDeleteCategoria = async (categoria: Categoria) => {
    try {
      await deleteCategoria(categoria.id);
      setCategorias(prevCategorias => prevCategorias.filter(c => c.id !== categoria.id));
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
  
      <GenericTable
        initialRecords={categorias}
        columns={[
          { key: "nombre", header: "Nombre" },
          { key: "descripcion", header: "Descripción" },
        ]}
        title="Categorías"
        description="Descripción de las categorías"
        onDelete={handleDeleteCategoria}
      />
      
    </div>
  );
}

