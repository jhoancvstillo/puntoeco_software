import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export const formSchemaUser = z.object({
  role: z.enum(["user", "admin"]),
  username: z.string().min(3, {
    message: "El nombre de usuario debe tener al menos 3 caracteres.",
  }),
  password: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, introduce una dirección de correo electrónico válida.",
  }),
  permisos: z.object({
    dashboard: z.boolean().default(false),
    combustible: z.boolean().default(false),
    fardos: z.boolean().default(false),
    vertedero: z.boolean().default(false),
  // Certificados
    pesaje: z.boolean().default(false),
    cotizacion: z.boolean().default(false),
    disposicionfinal: z.boolean().default(false),

    // inventario
    products: z.boolean().default(false),
    trabajadores: z.boolean().default(false),
    clientes: z.boolean().default(false),
    finanzas: z.boolean().default(false),

    configuracion: z.boolean().default(false),
  }),
});

type AddUserFormProps = {
  onSubmit: (values: z.infer<typeof formSchemaUser>) => void;
};

export function AddUserForm({ onSubmit }: AddUserFormProps) {
  const form = useForm<z.infer<typeof formSchemaUser>>({
    resolver: zodResolver(formSchemaUser),
    defaultValues: {
      role: "user",
      username: "",
      password: "",
      email: "",
      permisos: {
        dashboard: false,
        combustible: false,
        fardos: false,
        vertedero: false,
        pesaje: false,
        cotizacion: false,
        disposicionfinal: false,
        products: false,
        trabajadores: false,
        clientes: false,
        finanzas: false,
        configuracion: false,
      },
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de usuario</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del nuevo usuario" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Permisos</FormLabel>
          <div className="grid grid-cols-3 gap-4">
            {['dashboard', 'combustible', 'fardos', 'vertedero', 'pesaje', 'cotizacion', 'disposicionfinal', 'products',
              'trabajadores', 'clientes', 'finanzas', 'configuracion'].map((permiso) => (
              <FormField
                key={permiso}
                control={form.control}
                name={`permisos.${permiso}` as any}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {/* {permiso.charAt(0).toUpperCase() + permiso.slice(1)} */}
                      {/* si es certificadofinal entonces certificado final */}
                      {permiso === 'disposicionfinal' ? 'Disposición Final' : permiso.charAt(0).toUpperCase() + permiso.slice(1)}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </FormItem>
        <Button type="submit">Agregar Usuario</Button>
      </form>
    </Form>
  );
}

