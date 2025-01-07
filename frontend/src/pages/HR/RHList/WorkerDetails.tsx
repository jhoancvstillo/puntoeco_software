import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkerAttendance } from './WorkerAttendance';
import { WorkerNotes } from './WorkerNotes';
import { WorkerDocuments } from './WorkerDocuments';
import { WorkerVacations } from './WorkerVacations';
import { WorkerPayments } from './WorkerPayments';
import { WorkerTraining } from './WorkerTraining';
import { WorkerIncidents } from './WorkerIncidents';

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

interface WorkerDetailsProps {
  worker: Worker;
  onClose: () => void;
  onEdit: (worker: Worker) => void;
  onDelete: (workerId: number) => void;
}

export function WorkerDetails({ worker, onClose, onEdit, onDelete }: WorkerDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedWorker, setEditedWorker] = useState(worker);
  const [activeTab, setActiveTab] = useState("details");

  const handleEdit = () => {
    console.log("Edited Worker before submit:", editedWorker);
    onEdit(editedWorker);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este trabajador?')) {
      onDelete(worker.id);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{worker.name}</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="attendance">Asistencia</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="vacations">Vacaciones</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
            <TabsTrigger value="training">Capacitación</TabsTrigger>
            <TabsTrigger value="incidents">Incidentes</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={worker.photo || ''} alt={worker.name} />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
              </div>
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={editedWorker.name}
                      onChange={(e) => setEditedWorker({ ...editedWorker, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Posición</Label>
                    <Input
                      id="position"
                      value={editedWorker.position}
                      onChange={(e) => setEditedWorker({ ...editedWorker, position: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="join_date">Fecha de ingreso</Label>
                    <Input
                      id="join_date"
                      type="date"
                      value={editedWorker.join_date}
                      onChange={(e) => setEditedWorker({ ...editedWorker, join_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Estado</Label>
                    <Select
                      onValueChange={(value: 'active') => setEditedWorker({ ...editedWorker, status: value })}
                      defaultValue={editedWorker.status}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="rut">RUT</Label>
                    <Input
                      id="rut"
                      value={editedWorker.rut}
                      onChange={(e) => setEditedWorker({ ...editedWorker, rut: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={editedWorker.phone}
                      onChange={(e) => setEditedWorker({ ...editedWorker, phone: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label>Nombre</Label>
                    <p>{worker.name}</p>
                  </div>
                  <div>
                    <Label>Posición</Label>
                    <p>{worker.position}</p>
                  </div>
                  <div>
                    <Label>Fecha de ingreso</Label>
                    <p>{worker.join_date}</p>
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <p>{worker.status === 'active' ? 'Activo' : 'Inactivo'}</p>
                  </div>
                  <div>
                    <Label>RUT</Label>
                    <p>{worker.rut}</p>
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <p>{worker.phone}</p>
                  </div>
                  <div>
                    <Label>Es conductor</Label>
                    <p>{worker.is_driver ? 'Sí' : 'No'}</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              {isEditing ? (
                <>
                  <Button onClick={handleEdit}>Guardar</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(true)}>Editar</Button>
                  <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
                </>
              )}
            </div>
          </TabsContent>
          <TabsContent value="attendance">
            <WorkerAttendance workerId={worker.id} />
          </TabsContent>
          <TabsContent value="notes">
            <WorkerNotes workerId={worker.id} />
          </TabsContent>
          <TabsContent value="documents">
            <WorkerDocuments workerId={worker.id} />
          </TabsContent>
          <TabsContent value="vacations">
            <WorkerVacations workerId={worker.id} />
          </TabsContent>
          <TabsContent value="payments">
            <WorkerPayments workerId={worker.id} />
          </TabsContent>
          <TabsContent value="training">
            <WorkerTraining workerId={worker.id} />
          </TabsContent>
          <TabsContent value="incidents">
            <WorkerIncidents workerId={worker.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
