import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Classification, Subcategory } from "@/types/finance";
import { createClassification, createSubcategory, deleteClassification, deleteSubcategory } from "@/api/finanzas";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  classification_id: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

interface ClassificationManagerProps {
  type: "classification" | "subcategory";
  items: (Classification | Subcategory)[];
  onUpdate: () => void;
  classifications?: Classification[];
}

export const ClassificationManager: React.FC<ClassificationManagerProps> = ({
  type,
  items,
  onUpdate,
  classifications,
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      classification_id: undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (type === "subcategory") {
        if (!data.classification_id) {
          toast({
            title: "Error",
            description: "Debes seleccionar una clasificación para la subcategoría.",
            variant: "destructive",
          });
          return;
        }

        await createSubcategory({
          name: data.name,
          description: data.description,
          classification: data.classification_id,
        });
      } else {
        await createClassification({
          name: data.name,
          description: data.description,
        });
      }

      form.reset();
      onUpdate();
      toast({
        title: "Success",
        description: `${type} created successfully.`,
      });
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to create ${type}.`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar este ${type}?`)) {
      try {
        if (type === "classification") {
          await deleteClassification(id);
        } else {
          await deleteSubcategory(id);
        }
        onUpdate();
        toast({
          title: "Success",
          description: `${type} deleted successfully.`,
        });
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        toast({
          title: "Error",
          description: `Failed to delete ${type}.`,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{type === "classification" ? "Añadir clasificación" : "Añadir subcategoría"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={`Nombre del ${type}`} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {type === "subcategory" && classifications && (
                <FormField
                  control={form.control}
                  name="classification_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clasificación</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una clasificación" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classifications.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción (opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Descripción del elemento" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Agregar {type === "classification" ? "Clasificación" : "Subcategoría"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{type === "classification" ? "Clasificación" : "Subcategoría"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description || "Sin descripción"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

