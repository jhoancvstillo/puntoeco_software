"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PesajeProps } from "./form/schema";

interface WeightsSectionProps {
  form: UseFormReturn<PesajeProps>;
}

export function WeightsSection({ form }: WeightsSectionProps) {
  return (
    <div className="space-y-4">
      {/* <h3 className="font-semibold">Pesos</h3> */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="peso_1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peso Inicial</FormLabel>
              <FormControl>
                <Input
                  type="string"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange((e.target.value.toString()))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="peso_2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peso Final</FormLabel>
              <FormControl>
                <Input
                  type="string"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange((e.target.value.toString()))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
