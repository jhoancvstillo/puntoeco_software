import { useEffect, useState } from "react";
import { WorkerDetailSection } from "./WorkerDetailSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { getVacations, deleteVacation } from "@/api/trabajadores";
import { VacationDialog } from "./VacationDialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Vacation {
  id: number;
  type: "vacation" | "permission";
  start_date: string;
  end_date: string;
  reason: string;
  status: "approved" | "pending" | "rejected";
}

interface WorkerVacationsProps {
  workerId: number;
}

export function WorkerVacations({ workerId }: WorkerVacationsProps) {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVacation, setEditingVacation] = useState<Vacation | null>(null);

  useEffect(() => {
    fetchVacations();
  }, [workerId]);

  const fetchVacations = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getVacations(workerId);
      setVacations(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching vacations.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVacation = async (id: number) => {
    try {
      await deleteVacation(id);
      setVacations(vacations.filter((vac) => vac.id !== id));
    } catch (error) {
      console.error("Error deleting vacation:", error);
    }
  };

  const handleOpenDialog = (vacation?: Vacation) => {
    setEditingVacation(vacation || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingVacation(null);
    setIsDialogOpen(false);
  };

  const handleSaveVacation = () => {
    fetchVacations();
    handleCloseDialog();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <WorkerDetailSection title="Vacaciones y Permisos">
      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => handleOpenDialog()}
          className="flex items-center gap-2"
        >
          <PlusCircle size={16} />
          Agregar Vacación o Permiso
        </Button>
      </div>

      {vacations.length === 0 ? (
        <p className="text-muted-foreground">
          No hay registros de vacaciones o permisos para este trabajador.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha de inicio</TableHead>
              <TableHead>Fecha de fin</TableHead>
              <TableHead>Razón</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vacations.map((vacation) => (
              <TableRow key={vacation.id}>
                <TableCell>
                  {vacation.type === "vacation" ? "Vacación" : "Permiso"}
                </TableCell>
                <TableCell>
                  {format(new Date(vacation.start_date), "dd MMM yyyy", {
                    locale: es,
                  })}
                </TableCell>
                <TableCell>
                  {format(new Date(vacation.end_date), "dd MMM yyyy", {
                    locale: es,
                  })}
                </TableCell>
                <TableCell>{vacation.reason || "Sin especificar"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      vacation.status === "approved"
                        ? "default" // Usa "default" para aprobado
                        : vacation.status === "pending"
                        ? "secondary" // Usa "secondary" para pendiente
                        : "destructive" // Usa "destructive" para rechazado
                    }
                  >
                    {vacation.status === "approved"
                      ? "Aprobado"
                      : vacation.status === "pending"
                      ? "Pendiente"
                      : "Rechazado"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(vacation)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteVacation(vacation.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <VacationDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveVacation}
        vacation={editingVacation}
        workerId={workerId}
      />
    </WorkerDetailSection>
  );
}
