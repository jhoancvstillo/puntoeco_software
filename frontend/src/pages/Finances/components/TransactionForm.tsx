import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Classification, Subcategory } from "@/types/finance";
import { createTransaction, getClassifications, getSubcategories } from "@/api/finanzas";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";


const transactionSchema = z.object({
  date_time: z.string(),
  // transacion must be required
  transaction_type: z.enum(["Expense", "Income"]),
  classification_id: z.number(),
  subcategory_id: z.number(),
  comment: z.string().optional(),
  price: z.string(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;


interface TransactionFormProps {
  onChange: (value: boolean) => void;
  onClick: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onChange, onClick }) => {
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date_time: new Date().toISOString().slice(0, 16),
      transaction_type: "Expense",
      classification_id: 0,
      subcategory_id: 0,
      comment: "",
      price: "",
    },
  });

  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  useEffect(() => {
    fetchClassifications();
    fetchSubcategories();
  }, []);

  const fetchClassifications = async () => {
    try {
      const data = await getClassifications();
      setClassifications(data);
    } catch (error) {
      console.error("Error fetching classifications:", error);
      toast({
        title: "Error",
        description: "Failed to load classifications.",
        variant: "destructive",
      });
    }
  };

  const fetchSubcategories = async () => {
    try {
      const data = await getSubcategories();
      setSubcategories(data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast({
        title: "Error",
        description: "Failed to load subcategories.",
        variant: "destructive",
      });
    }
  };

  // 1. "Miramos" el valor seleccionado de la clasificación:
  const watchClassificationId = form.watch("classification_id");

  // 2. Filtramos las subcategorías según la clasificación elegida:
  const filteredSubcategories = subcategories.filter(
    (subcategory) => subcategory.classification === watchClassificationId
  );

  const handleSubmit = async (data: TransactionFormData) => {

    try {
      const formattedData = {
        date_time: new Date(data.date_time).toISOString(),
        transaction_type: data.transaction_type,
        classification_id: data.classification_id,
        subcategory_id: data.subcategory_id,
        comment: data.comment || "",
        price: data.price,
      };

      await createTransaction(formattedData);
      toast({
        title: "Success",
        description: "Transaction created successfully.",
      });

     
      
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to create transaction.",
        variant: "destructive",
      });
    }
    form.reset();
    onChange(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Fecha y Hora */}
        <FormField
          control={form.control}
          name="date_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha y Hora</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tipo de Transacción */}
        <FormField
          control={form.control}
          name="transaction_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Transacción</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Expense">Gasto</SelectItem>
                  <SelectItem value="Income">Ingreso</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Clasificación */}
        <FormField
          control={form.control}
          name="classification_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clasificación</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar clasificación" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classifications.map((classification) => (
                    <SelectItem
                      key={classification.id}
                      value={classification.id.toString()}
                    >
                      {classification.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Subcategoría (filtrada) */}
        <FormField
          control={form.control}
          name="subcategory_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategoría</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar subcategoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredSubcategories.map((subcategory) => (
                    <SelectItem
                      key={subcategory.id}
                      value={subcategory.id.toString()}
                    >
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Comentario */}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentario</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Precio */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" >
            Cancelar
          </Button>
          <Button type="submit" onClick={
            onClick
          }>Guardar</Button>
        </div>
      </form>
    </Form>
  );
};
