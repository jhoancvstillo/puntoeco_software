import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createVacation, editVacation } from "@/api/trabajadores";

interface Vacation {
  id?: number;
  type: 'vacation' | 'permission';
  start_date: string;
  end_date: string;
  reason: string;
  status: 'approved' | 'pending' | 'rejected';
}

interface VacationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  vacation: Vacation | null;
  workerId: number;
}

export function VacationDialog({ isOpen, onClose, onSave, vacation, workerId }: VacationDialogProps) {
  const [formData, setFormData] = useState<Vacation>({
    type: 'vacation',
    start_date: '',
    end_date: '',
    reason: '',
    status: 'pending',
  });

  useEffect(() => {
    if (vacation) {
      setFormData(vacation);
    } else {
      setFormData({
        type: 'vacation',
        start_date: '',
        end_date: '',
        reason: '',
        status: 'pending',
      });
    }
  }, [vacation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (vacation) {
        await editVacation(formData);
      } else {
        await createVacation({ ...formData, workerId });
      }
      onSave();
    } catch (error) {
      console.error('Error saving vacation:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{vacation ? 'Editar' : 'Agregar'} Vacación o Permiso</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              name="type"
              value={formData.type}
              onValueChange={(value) => handleSelectChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">Vacación</SelectItem>
                <SelectItem value="permission">Permiso</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="start_date">Fecha de inicio</Label>
            <Input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">Fecha de fin</Label>
            <Input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Razón</Label>
            <Input
              type="text"
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Razón de la vacación o permiso"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              name="status"
              value={formData.status}
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="approved">Aprobado</SelectItem>
                <SelectItem value="rejected">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">{vacation ? 'Guardar cambios' : 'Crear'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

