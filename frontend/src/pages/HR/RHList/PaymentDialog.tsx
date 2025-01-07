import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPayment, editPayment } from "@/api/trabajadores";

interface Payment {
  id?: number;
  worker: number;
  date: string;
  base_salary: string;
  bonuses: string;
  deductions: string;
  total_paid: string;
}

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  payment: Payment | null;
  workerId: number;
}

export function PaymentDialog({ isOpen, onClose, onSave, payment, workerId }: PaymentDialogProps) {
  const [formData, setFormData] = useState<Payment>({
    worker: workerId,
    date: '',
    base_salary: '',
    bonuses: '',
    deductions: '',
    total_paid: '',
  });

  useEffect(() => {
    if (payment) {
      setFormData(payment);
    } else {
      setFormData({
        worker: workerId,
        date: '',
        base_salary: '',
        bonuses: '',
        deductions: '',
        total_paid: '',
      });
    }
  }, [payment, workerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateTotalPaid = () => {
    const base = parseFloat(formData.base_salary) || 0;
    const bonuses = parseFloat(formData.bonuses) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    return (base + bonuses - deductions).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const paymentData = {
        ...formData,
        worker: workerId,
        base_salary: parseFloat(formData.base_salary).toFixed(2),
        bonuses: parseFloat(formData.bonuses).toFixed(2),
        deductions: parseFloat(formData.deductions).toFixed(2),
        total_paid: calculateTotalPaid(),
      };
      if (payment) {
        await editPayment(paymentData);
      } else {
        await createPayment(paymentData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{payment ? 'Editar' : 'Agregar'} Pago</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Fecha de pago</Label>
            <Input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="base_salary">Salario base</Label>
            <Input
              type="number"
              step="0.01"
              id="base_salary"
              name="base_salary"
              value={formData.base_salary}
              onChange={handleChange}
              placeholder="Salario base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bonuses">Bonificaciones</Label>
            <Input
              type="number"
              step="0.01"
              id="bonuses"
              name="bonuses"
              value={formData.bonuses}
              onChange={handleChange}
              placeholder="Bonificaciones"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deductions">Deducciones</Label>
            <Input
              type="number"
              step="0.01"
              id="deductions"
              name="deductions"
              value={formData.deductions}
              onChange={handleChange}
              placeholder="Deducciones"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_paid">Total pagado</Label>
            <div className="text-lg font-semibold">
              {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(parseFloat(calculateTotalPaid()))}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{payment ? 'Guardar cambios' : 'Crear'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

