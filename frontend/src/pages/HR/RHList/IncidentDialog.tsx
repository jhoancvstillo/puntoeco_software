import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createIncident, editIncident } from "@/api/trabajadores";

interface Incident {
  id?: number;
  worker: number;
  date: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  corrective_action: string;
}

interface IncidentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  incident: Incident | null;
  workerId: number;
}

export function IncidentDialog({ isOpen, onClose, onSave, incident, workerId }: IncidentDialogProps) {
  const [formData, setFormData] = useState<Incident>({
    worker: workerId,
    date: '',
    description: '',
    severity: 'Low',
    corrective_action: '',
  });

  useEffect(() => {
    if (incident) {
      setFormData(incident);
    } else {
      setFormData({
        worker: workerId,
        date: '',
        description: '',
        severity: 'Low',
        corrective_action: '',
      });
    }
  }, [incident, workerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSeverityChange = (value: string) => {
    setFormData({ ...formData, severity: value as 'Low' | 'Medium' | 'High' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const incidentData = {
        ...formData,
        worker: workerId,
      };
      if (incident) {
        await editIncident(incidentData);
      } else {
        await createIncident(incidentData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving incident:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{incident ? 'Editar' : 'Agregar'} Incidente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción del incidente"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="severity">Severidad</Label>
            <Select onValueChange={handleSeverityChange} value={formData.severity}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar severidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Baja</SelectItem>
                <SelectItem value="Medium">Media</SelectItem>
                <SelectItem value="High">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="corrective_action">Acción Correctiva</Label>
            <Textarea
              id="corrective_action"
              name="corrective_action"
              value={formData.corrective_action}
              onChange={handleChange}
              placeholder="Acción correctiva"
            />
          </div>
          <DialogFooter>
            <Button type="submit">{incident ? 'Guardar cambios' : 'Crear'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
