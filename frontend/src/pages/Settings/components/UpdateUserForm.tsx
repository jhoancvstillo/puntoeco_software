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
import { User } from "@/types/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "El nombre de usuario debe tener al menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, introduce una dirección de correo electrónico válida.",
  }),
  // role_input: z.enum(["user", "admin"]),
  role: z.enum(["user", "admin"]),
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

type UpdateUserFormProps = {
  user: User;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
};

export function UpdateUserForm({ user, onSubmit }: UpdateUserFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      // role_input: user.role as "user" | "admin",
      role: user.role as "user" | "admin",
      permisos: {
        dashboard: user.permisos?.dashboard || false,
        combustible: user.permisos?.combustible || false,
        fardos: user.permisos?.fardos || false,
        vertedero: user.permisos?.vertedero || false,
        // Certificados
        pesaje: user.permisos?.pesaje || false,
        cotizacion: user.permisos?.cotizacion || false,
        disposicionfinal: user.permisos?.disposicionfinal || false,

        // inventario
        products: user.permisos?.products || false,
        trabajadores: user.permisos?.trabajadores || false,
        clientes: user.permisos?.clientes || false,
        finanzas: user.permisos?.finanzas || false,

        configuracion: user.permisos?.configuracion || false,
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
                <Input {...field} />
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
                <Input type="email" {...field} />
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
                  <SelectTrigger className="w-full">
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
            {[
              "dashboard",
              "combustible",
              "fardos",
              "vertedero",
              "pesaje",
              "cotizacion",
              "disposicionfinal",
              "products",
              "trabajadores",
              "clientes",
              "finanzas",
              "configuracion",
            ].map((permiso) => (
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
                        disabled={form.watch("role") === "admin"}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {permiso === "disposicionfinal"
                        ? "Disposición Final"
                        : permiso.charAt(0).toUpperCase() + permiso.slice(1)}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </FormItem>

        <Button type="submit">Actualizar Usuario</Button>
      </form>
    </Form>
  );
}
