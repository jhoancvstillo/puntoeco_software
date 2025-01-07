import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTraining, editTraining } from "@/api/trabajadores";

interface Training {
  id?: number;
  worker: number;
  course_name: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Pending';
}

interface TrainingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  training: Training | null;
  workerId: number;
}

export function TrainingDialog({ isOpen, onClose, onSave, training, workerId }: TrainingDialogProps) {
  const [formData, setFormData] = useState<Training>({
    worker: workerId,
    course_name: '',
    date: '',
    status: 'Pending',
  });

  useEffect(() => {
    if (training) {
      setFormData(training);
    } else {
      setFormData({
        worker: workerId,
        course_name: '',
        date: '',
        status: 'Pending',
      });
    }
  }, [training, workerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value as 'Completed' | 'In Progress' | 'Pending' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const trainingData = {
        ...formData,
        worker: workerId,
      };
      if (training) {
        await editTraining(trainingData);
      } else {
        await createTraining(trainingData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving training:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{training ? 'Editar' : 'Agregar'} Entrenamiento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="course_name">Nombre del curso</Label>
            <Input
              id="course_name"
              name="course_name"
              value={formData.course_name}
              onChange={handleChange}
              placeholder="Nombre del curso"
            />
          </div>
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
            <Label htmlFor="status">Estado</Label>
            <Select onValueChange={handleStatusChange} value={formData.status}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Completed">Completado</SelectItem>
                <SelectItem value="In Progress">En progreso</SelectItem>
                <SelectItem value="Pending">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">{training ? 'Guardar cambios' : 'Crear'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

