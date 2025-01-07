import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { descargarCertificadoDF } from "@/api/destinoFinal"
import { SearchableInput } from "@/components/forms/SearchabeInput"
import { useEffect, useState } from "react"
import { getClientsNormal } from "@/api/clients"
import { Cliente } from "@/types/client"

const formSchema = z.object({
  client_id: z.number().int().positive(),
  fecha_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido. Use YYYY-MM-DD"),
  fecha_final: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido. Use YYYY-MM-DD"),
})

export function ExportarDocumentosForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: 0,
      fecha_inicio: "",
      fecha_final: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        console.log('Values:', values);
      const response = await descargarCertificadoDF(values);
      console.log('Response:', response);
      // Aquí puedes manejar la respuesta, por ejemplo, crear un enlace de descarga
    } catch (error) {
      console.error('Error al descargar:', error);
    }
  }

  const [clients, setClients] = useState<Cliente[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
          const clientsData = await getClientsNormal();
          setClients(clientsData);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
    };
    fetchClients();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID del Cliente</FormLabel>
              <FormControl>
                {/* <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} /> */}
                <SearchableInput
                    items={clients}
                    displayKey="name"
                    onSelect={(item) => field.onChange(item.id)}

                   />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fecha_inicio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha Inicial</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fecha_final"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha Final</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Descargar</Button>
      </form>
    </Form>
  )
}

