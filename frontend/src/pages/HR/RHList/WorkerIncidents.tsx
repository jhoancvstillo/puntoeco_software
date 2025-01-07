import  { useEffect, useState } from 'react';
import { WorkerDetailSection } from './WorkerDetailSection';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { getIncidents, deleteIncident } from "@/api/trabajadores";
import { IncidentDialog } from './IncidentDialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Incident {
  id: number;
  worker: number;
  date: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  corrective_action: string;
}

interface WorkerIncidentsProps {
  workerId: number;
}

export function WorkerIncidents({ workerId }: WorkerIncidentsProps) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);

  useEffect(() => {
    fetchIncidents();
  }, [workerId]);

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getIncidents(workerId);
      setIncidents(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching incidents.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIncident = async (id: number) => {
    try {
      await deleteIncident(id);
      setIncidents(incidents.filter((incident) => incident.id !== id));
    } catch (error) {
      console.error('Error deleting incident:', error);
    }
  };

  const handleOpenDialog = (incident?: Incident) => {
    setEditingIncident(incident || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingIncident(null);
    setIsDialogOpen(false);
  };

  const handleSaveIncident = () => {
    fetchIncidents();
    handleCloseDialog();
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const translateSeverity = (severity: string) => {
    switch (severity) {
      case 'Low':
        return 'Baja';
      case 'Medium':
        return 'Media';
      case 'High':
        return 'Alta';
      default:
        return severity;
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <WorkerDetailSection title="Gestión de Incidentes">
      <div className="mb-4 flex justify-end">
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <PlusCircle size={16} />
          Agregar Incidente
        </Button>
      </div>

      {incidents.length === 0 ? (
        <p className="text-muted-foreground">No hay registros de incidentes para este trabajador.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Severidad</TableHead>
              <TableHead>Acción Correctiva</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.map((incident) => (
              <TableRow key={incident.id}>
                <TableCell>{format(new Date(incident.date), 'dd MMM yyyy', { locale: es })}</TableCell>
                <TableCell>{incident.description}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityClass(incident.severity)}`}>
                    {translateSeverity(incident.severity)}
                  </span>
                </TableCell>
                <TableCell>{incident.corrective_action || 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(incident)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteIncident(incident.id)}
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

      <IncidentDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveIncident}
        incident={editingIncident}
        workerId={workerId}
      />
    </WorkerDetailSection>
  );
}
