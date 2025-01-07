import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDebtSchema } from "./schema";
import { addDebtForm } from "../types/types";
import { createDebt } from "@/api/fardos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function DebtForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<addDebtForm | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<addDebtForm>({ resolver: zodResolver(addDebtSchema) });

  const onSubmit = (data: addDebtForm) => {
    setFormData(data);
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    if (formData) {
      createDebt(formData);
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Registrar Deuda</CardTitle>
          <CardDescription>Ingrese los detalles de la deuda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  {...register("date")}
                  className="w-full"
                />
                {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="reported_weight">Peso Reportado</Label>
                <Input
                  id="reported_weight"
                  type="number"
                  {...register("reported_weight", { valueAsNumber: true })}
                  className="w-full"
                />
                {errors.reported_weight && <p className="text-sm text-red-500">{errors.reported_weight.message}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="accepted_weight">Peso Aceptado</Label>
                <Input
                  id="accepted_weight"
                  type="number"
                  {...register("accepted_weight", { valueAsNumber: true })}
                  className="w-full"
                />
                {errors.accepted_weight && <p className="text-sm text-red-500">{errors.accepted_weight.message}</p>}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSubmit(onSubmit)}>Enviar</Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Registro de Deuda</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea registrar la siguiente información de deuda?
            </DialogDescription>
          </DialogHeader>
          {formData && (
            <div className="py-4">
              <p><strong>Fecha:</strong> {format(new Date(formData.date), 'PPP', { locale: es })}</p>
              <p><strong>Peso Reportado:</strong> {formData.reported_weight} kg</p>
              <p><strong>Peso Aceptado:</strong> {formData.accepted_weight} kg</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleConfirm}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
