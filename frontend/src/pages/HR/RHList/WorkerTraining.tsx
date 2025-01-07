import  { useEffect, useState } from 'react';
import { WorkerDetailSection } from './WorkerDetailSection';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { getTrainings, deleteTraining } from "@/api/trabajadores";
import { TrainingDialog } from './TrainingDialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Training {
  id: number;
  worker: number;
  course_name: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Pending';
}

interface WorkerTrainingProps {
  workerId: number;
}

export function WorkerTraining({ workerId }: WorkerTrainingProps) {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);

  useEffect(() => {
    fetchTrainings();
  }, [workerId]);

  const fetchTrainings = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getTrainings(workerId);
      setTrainings(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching trainings.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTraining = async (id: number) => {
    try {
      await deleteTraining(id);
      setTrainings(trainings.filter((training) => training.id !== id));
    } catch (error) {
      console.error('Error deleting training:', error);
    }
  };

  const handleOpenDialog = (training?: Training) => {
    setEditingTraining(training || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingTraining(null);
    setIsDialogOpen(false);
  };

  const handleSaveTraining = () => {
    fetchTrainings();
    handleCloseDialog();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="default">Completado</Badge>; // Cambiado a "default"
      case 'In Progress':
        return <Badge variant="secondary">En progreso</Badge>; // Cambiado a "secondary"
      case 'Pending':
        return <Badge variant="outline">Pendiente</Badge>; // Cambiado a "outline"
      default:
        return <Badge>{status}</Badge>;
    }
  };
  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <WorkerDetailSection title="Entrenamiento y Desarrollo">
      <div className="mb-4 flex justify-end">
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <PlusCircle size={16} />
          Agregar Entrenamiento
        </Button>
      </div>

      {trainings.length === 0 ? (
        <p className="text-muted-foreground">No hay registros de entrenamiento para este trabajador.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre del curso</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainings.map((training) => (
              <TableRow key={training.id}>
                <TableCell>{training.course_name}</TableCell>
                <TableCell>{format(new Date(training.date), 'dd MMM yyyy', { locale: es })}</TableCell>
                <TableCell>{getStatusBadge(training.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(training)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTraining(training.id)}
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

      <TrainingDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveTraining}
        training={editingTraining}
        workerId={workerId}
      />
    </WorkerDetailSection>
  );
}

