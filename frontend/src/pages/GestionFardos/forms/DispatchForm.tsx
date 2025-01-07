import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDispatchSchema } from "./schema";
import { addDispatchForm } from "../types/types";
import { createDispatch } from "@/api/fardos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function DispatchForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<addDispatchForm | null>(null);

const defaultValues: addDispatchForm = {
    date: "",
    bales: 0,
    destination: "SOREPA",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<addDispatchForm>({ resolver: zodResolver(addDispatchSchema), defaultValues });

  const onSubmit = (data: addDispatchForm) => {
    setFormData(data);
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    if (formData) {
      createDispatch(formData);
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Registrar Despacho</CardTitle>
          <CardDescription>Ingrese los detalles del despacho de fardos.</CardDescription>
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
                <Label htmlFor="bales">Número de Fardos</Label>
                <Input
                  id="bales"
                  type="number"
                  {...register("bales", { valueAsNumber: true })}
                  className="w-full"
                />
                {errors.bales && <p className="text-sm text-red-500">{errors.bales.message}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="destination">Destino</Label>
                <Input
                  id="destination"
                  type="text"
                  {...register("destination")}
                  className="w-full"
                />
                {errors.destination && <p className="text-sm text-red-500">{errors.destination.message}</p>}
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
            <DialogTitle>Confirmar Registro de Despacho</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea registrar la siguiente información de despacho?
            </DialogDescription>
          </DialogHeader>
          {formData && (
            <div className="py-4">
              <p><strong>Fecha:</strong> {format(new Date(formData.date), 'PPP', { locale: es })}</p>
              <p><strong>Número de Fardos:</strong> {formData.bales}</p>
              <p><strong>Destino:</strong> {formData.destination}</p>
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

