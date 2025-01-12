import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, UserX } from "lucide-react";
import { Cliente } from "@/types/client";
import { Conductor } from "@/types/conductor";
import { getDriverById, deleteDriver, createDriver } from "@/api/clients";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [conductorToDelete, setConductorToDelete] = useState<Conductor | null>(
    null
  );
  const [isAddingConductor, setIsAddingConductor] = useState(false);
  const [newConductor, setNewConductor] = useState({ nombre: "", rut: "" });
  const { toast } = useToast();

  const fetchConductores = async () => {
    if (cliente && isOpen) {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDriverById(cliente.id);
        setConductores(data);
        // Si data es un array vacío, significa que no hay conductores
        if (data.length === 0) {
          setError("no_drivers");
        }
      } catch (err) {
        setError("no_drivers");
        console.error("Error fetching conductores:", err);
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
        console.error("Error deleting conductor:", err);
        toast({
          title: "Error",
          description:
            "No se pudo eliminar el conductor. Por favor, intente de nuevo.",
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
          cliente: cliente.id,
        });
        toast({
          title: "Conductor agregado",
          description: "El nuevo conductor ha sido agregado exitosamente.",
        });
        setNewConductor({ nombre: "", rut: "" });
        setIsAddingConductor(false);
        fetchConductores();
      } catch (err) {
        console.error("Error adding conductor:", err);
        toast({
          title: "Error",
          description:
            "No se pudo agregar el conductor. Por favor, intente de nuevo.",
          variant: "destructive",
        });
      }
    }
  };

  if (!cliente) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col bg-white dark:bg-gray-800 text-black dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              Detalles del Cliente y Conductores Referidos
            </DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto pr-4 -mr-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid gap-4 py-4"
            >
              <div className="grid grid-cols-4 items-center gap-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <span className="font-bold">Nombre:</span>
                <span className="col-span-3">{cliente.name}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <span className="font-bold">RUT:</span>
                <span className="col-span-3">{cliente.rut}</span>
              </div>

              <div className="mt-4">
                <h3 className="font-bold mb-2 text-xl">
                  Conductores Referidos:
                </h3>
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center items-center h-32"
                  >
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </motion.div>
                ) : error === "no_drivers" || conductores.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center h-32 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  >
                    <UserX className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No hay conductores referidos para este cliente.
                    </p>
                  </motion.div>
                ) : error ? (
                  <p className="text-red-500 dark:text-red-400">{error}</p>
                ) : (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="dark:text-gray-300">
                              Nombre
                            </TableHead>
                            <TableHead className="dark:text-gray-300">
                              RUT
                            </TableHead>
                            <TableHead className="text-right dark:text-gray-300">
                              Acciones
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {conductores.map((conductor) => (
                            <motion.tr
                              key={conductor.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <TableCell className="dark:text-gray-300">
                                {conductor.nombre}
                              </TableCell>
                              <TableCell className="dark:text-gray-300">
                                {conductor.rut}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    setConductorToDelete(conductor)
                                  }
                                >
                                  <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                                </Button>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <AnimatePresence>
              {!isAddingConductor ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    onClick={() => setIsAddingConductor(true)}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Agregar Conductor
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleAddConductor}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="dark:text-gray-300">
                      Nombre
                    </Label>
                    <Input
                      id="nombre"
                      value={newConductor.nombre}
                      onChange={(e) =>
                        setNewConductor({
                          ...newConductor,
                          nombre: e.target.value,
                        })
                      }
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rut" className="dark:text-gray-300">
                      RUT
                    </Label>
                    <Input
                      id="rut"
                      value={newConductor.rut}
                      onChange={(e) =>
                        setNewConductor({
                          ...newConductor,
                          rut: e.target.value,
                        })
                      }
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddingConductor(false)}
                      className="dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 transition-colors duration-300"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300"
                    >
                      Agregar
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!conductorToDelete}
        onOpenChange={() => setConductorToDelete(null)}
      >
        <AlertDialogContent className="bg-white dark:bg-gray-800 text-black dark:text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-300">
              ¿Estás seguro que quieres eliminar al conductor{" "}
              {conductorToDelete?.nombre} con RUT {conductorToDelete?.rut}? Esta
              acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 transition-colors duration-300">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConductor}
              className="bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
