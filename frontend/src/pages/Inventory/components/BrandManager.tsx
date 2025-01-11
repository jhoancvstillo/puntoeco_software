import React, { useState } from 'react';
import { createMarca, deleteMarca } from '@/api/productos';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Marca } from '../types/inventory'
import GenericTable from '@/components/GenericTable';

interface BrandManagerProps {
  marcas: Marca[];
  setMarcas: React.Dispatch<React.SetStateAction<Marca[]>>;
}

export function BrandManager({ marcas, setMarcas }: BrandManagerProps) {
  const [newMarca, setNewMarca] = useState({ nombre: '', descripcion: '' });

  const handleCreateMarca = async () => {
    try {
      const createdMarca = await createMarca(newMarca);
      setMarcas(prevMarcas => [...prevMarcas, createdMarca]);
      setNewMarca({ nombre: '', descripcion: '' });
    } catch (error) {
      console.error('Error creating marca:', error);
    }
  };


  const handleDeleteMarca = async (marca: Marca) => {
    try {
      await deleteMarca(marca.id);
      setMarcas(prevMarcas => prevMarcas.filter(m => m.id !== marca.id));
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

        <GenericTable
        initialRecords={marcas}
        columns={
          [
            { key: "nombre", header: "Nombre" },
            { key: "descripcion", header: "Descripción" },
          ]
        }
        title="Marcas"
        description="Descripción de las marcas"
        onDelete={handleDeleteMarca}
        />

    </div>
  );
}

