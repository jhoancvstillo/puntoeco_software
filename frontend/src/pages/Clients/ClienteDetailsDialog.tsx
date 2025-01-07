import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { Cliente } from '@/types/client';
import { Conductor } from '@/types/conductor';
import { getDriverById, deleteDriver, createDriver } from '@/api/clients';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ClienteDetailsDialogProps {
  cliente: Cliente | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClienteDetailsDialog: React.FC<ClienteDetailsDialogProps> = ({
  cliente,
  isOpen,
  onOpenChange,
}) => {
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conductorToDelete, setConductorToDelete] = useState<Conductor | null>(null);
  const [isAddingConductor, setIsAddingConductor] = useState(false);
  const [newConductor, setNewConductor] = useState({ nombre: '', rut: '' });
  const { toast } = useToast();

  const fetchConductores = async () => {
    if (cliente && isOpen) {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDriverById(cliente.id);
        setConductores(data);
      } catch (err) {
        setError('Error al cargar los conductores');
        console.error('Error fetching conductores:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchConductores();
  }, [cliente, isOpen]);

  const handleDeleteConductor = async () => {
    if (conductorToDelete) {
      try {
        await deleteDriver(conductorToDelete.id);
        toast({
          title: "Conductor eliminado",
          description: "El conductor ha sido eliminado exitosamente.",
        });
        fetchConductores();
      } catch (err) {
        console.error('Error deleting conductor:', err);
        toast({
          title: "Error",
          description: "No se pudo eliminar el conductor. Por favor, intente de nuevo.",
          variant: "destructive",
        });
      } finally {
        setConductorToDelete(null);
      }
    }
  };

  const handleAddConductor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cliente) {
      try {
        await createDriver({
          ...newConductor,
          cliente: cliente.id
        });
        toast({
          title: "Conductor agregado",
          description: "El nuevo conductor ha sido agregado exitosamente.",
        });
        setNewConductor({ nombre: '', rut: '' });
        setIsAddingConductor(false);
        fetchConductores();
      } catch (err) {
        console.error('Error adding conductor:', err);
        toast({
          title: "Error",
          description: "No se pudo agregar el conductor. Por favor, intente de nuevo.",
          variant: "destructive",
        });
      }
    }
  };

  if (!cliente) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles del Cliente y Conductores Referidos</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Nombre:</span>
              <span className="col-span-3">{cliente.name}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">RUT:</span>
              <span className="col-span-3">{cliente.rut}</span>
            </div>
            
            <div className="mt-4">
              <h3 className="font-bold mb-2">Conductores Referidos:</h3>
              {isLoading ? (
                <p>Cargando conductores...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : conductores.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>RUT</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conductores.map((conductor) => (
                      <TableRow key={conductor.id}>
                        <TableCell>{conductor.nombre}</TableCell>
                        <TableCell>{conductor.rut}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setConductorToDelete(conductor)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No hay conductores referidos para este cliente.</p>
              )}
            </div>

            {/* Fin de la sección de la tabla de conductores */}

            {/* Botón de Agregar Conductor */}
            <div className="mt-6">
              {!isAddingConductor ? (
                <Button 
                  onClick={() => setIsAddingConductor(true)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="mr-2 h-4 w-4" /> Agregar Conductor
                </Button>
              ) : (
                <form onSubmit={handleAddConductor} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={newConductor.nombre}
                      onChange={(e) => setNewConductor({...newConductor, nombre: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rut">RUT</Label>
                    <Input
                      id="rut"
                      value={newConductor.rut}
                      onChange={(e) => setNewConductor({...newConductor, rut: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddingConductor(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Agregar</Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!conductorToDelete} onOpenChange={() => setConductorToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro que quieres eliminar al conductor {conductorToDelete?.nombre} con RUT {conductorToDelete?.rut}?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConductor}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

