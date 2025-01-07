import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { VertederoData, VertederoDataForm } from "../types/Vertedero";

const formSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido"),
  weight_kg: z.number().min(0, "El peso debe ser mayor o igual a 0").multipleOf(0.01),
  value: z.number().multipleOf(0.01),
});

interface RecordFormProps {
  onSubmit: (data: VertederoDataForm) => void;
  initialData?: VertederoData;
}

export default function RecordForm({ onSubmit, initialData }: RecordFormProps) {
  const [isEditing, setIsEditing] = useState(!!initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<z.infer<typeof formSchema> | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      date: "",
      weight_kg: 0,
      value: 0,
    },
  });

  const handleDialogConfirm = () => {
    if (formData) {
      onSubmit(formData); // Envía los datos al padre
      form.reset();
      setIsEditing(false);
      setIsDialogOpen(false);
    }
  };

  const handleDialogCancel = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit: (values: z.infer<typeof formSchema>) => void = (values) => {
    setFormData(values); // Guarda los datos temporalmente
    setIsDialogOpen(true); // Abre el diálogo de confirmación
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>Seleccione la fecha del registro</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight_kg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Ingrese el peso en kilogramos</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Ingrese el valor asociado</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <Button type="submit">{isEditing ? "Actualizar" : "Guardar"}</Button>
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setIsEditing(false);
                }}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* Diálogo de confirmación */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Registro</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea registrar esta información?
            </DialogDescription>
          </DialogHeader>
          {formData && (
            <div className="py-4">
              <p><strong>Fecha:</strong> {formData.date}</p>
              <p><strong>Peso (kg):</strong> {formData.weight_kg} kg</p>
              <p><strong>Valor:</strong> ${formData.value}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogCancel}>Cancelar</Button>
            <Button onClick={handleDialogConfirm}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
