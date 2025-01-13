import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Plus, Search } from 'lucide-react';
import { AddWorkerForm, WorkerFormData } from './Forms/AddWorkerForm';

import { WorkerDetails } from './WorkerDetails';
import { getTrabajadores, editTrabajador, deleteTrabajador, addTrabajador } from "@/api/trabajadores"; // Importa desde tu archivo API

interface Worker {
  id: number;
  photo: string | null;
  name: string;
  position: string;
  join_date: string;
  status: 'active' | 'inactive';
  rut: string;
  phone: string;
  is_driver: boolean;
}

export function RHList() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTrabajadores();
        setWorkers(data || []);
      } catch (err) {
        setError((err as Error).message || "Error cargando trabajadores.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const filteredWorkers = workers.filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.position.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleOnSubmit = async (newWorker: WorkerFormData) => {
  
    // (1) Crear FormData
    const formData = new FormData();
  
    // (2) Agregar campos “string” a FormData
    formData.append("name", newWorker.name);
    formData.append("position", newWorker.position);
    formData.append("join_date", newWorker.join_date);
    formData.append("status", newWorker.status);
    formData.append("rut", newWorker.rut);
    formData.append("phone", newWorker.phone);
    formData.append("is_driver", String(newWorker.is_driver)); // booleans hay que convertirlos a string
  
    // (3) Agregar la foto, si existe
    //    Si tu schema obliga a que siempre haya una foto, no necesitas hacer el check “if”
    if (newWorker.photo && newWorker.photo.length > 0) {
      formData.append("photo", newWorker.photo[0]); 
      // O si quieres enviar más archivos, iterar el FileList
    }
  
    try {
      // (4) Llamar a addTrabajador, pasándole el FormData
      await addTrabajador(formData);
  
      // (5) Cerrar modal y refrescar lista
      setIsAddWorkerOpen(false);
      getTrabajadores().then(data => setWorkers(data || []));
    } catch (err) {
      console.error("Error adding worker:", err);
    }
  };
  
  const handleEditWorker = async (editedWorker: Worker) => {
    try {
      const updatedWorker = await editTrabajador(editedWorker);
      setWorkers(workers.map(w => w.id === editedWorker.id ? updatedWorker : w));
      setSelectedWorker(null);
    } catch (err) {
      console.error('Error editing worker:', err);
    }
  };

  const handleDeleteWorker = async (workerId: number) => {
    try {
      await deleteTrabajador(workerId);
      setWorkers(workers.filter(w => w.id !== workerId));
      setSelectedWorker(null);
    } catch (err) {
      console.error('Error deleting worker:', err);
    }
  };

  if (loading) {
    return <p>Cargando trabajadores...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8 w-[600px]"
            placeholder="Buscar trabajadores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddWorkerOpen} onOpenChange={setIsAddWorkerOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Agregar Trabajador</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Trabajador</DialogTitle>
            </DialogHeader>
            <AddWorkerForm onSubmit={handleOnSubmit} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Foto</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Posición</TableHead>
            <TableHead>Fecha de Ingreso</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredWorkers.map((worker) => (
            <TableRow key={worker.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={worker.photo || ''} alt={worker.name} />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{worker.name}</TableCell>
              <TableCell>{worker.position}</TableCell>
              <TableCell>{worker.join_date}</TableCell>
              <TableCell>{worker.status === 'active' ? 'Activo' : 'Inactivo'}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" onClick={() => setSelectedWorker(worker)}>Ver</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedWorker && (
        <WorkerDetails
          worker={selectedWorker}
          onClose={() => setSelectedWorker(null)}
          onEdit={handleEditWorker}
          onDelete={handleDeleteWorker}
        />
      )}
    </div>
  );
}
