import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addBalesSchema } from "./schema";
import { addBalesForm } from "../types/types";
import { addProduction } from "@/api/fardos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AddBalesForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<addBalesForm | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<addBalesForm>({ resolver: zodResolver(addBalesSchema) });

  const onSubmit = (data: addBalesForm) => {
    setFormData(data);
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    if (formData) {
      addProduction(formData);
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Agregar Fardos</CardTitle>
          <CardDescription>Ingrese los detalles de producción para nuevos fardos.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="bales">Número de Fardos</Label>
                <Input
                  id="bales"
                  type="number"
                  {...register("bales", { valueAsNumber: true })}
                  className="w-full"
                />
                {errors.bales && <p className="text-sm text-red-500">{errors.bales.message}</p>}
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
            <DialogTitle>Confirmar Envío</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea enviar la siguiente información?
            </DialogDescription>
          </DialogHeader>
          {formData && (
            <div className="py-4">
              <p><strong>Fecha:</strong> {format(new Date(formData.date), 'PPP', { locale: es })}</p>
              <p><strong>Número de Fardos:</strong> {formData.bales}</p>
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
