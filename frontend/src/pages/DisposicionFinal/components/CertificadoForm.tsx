"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Categoria } from "../types/certificado";
import { SearchableInput } from "@/components/forms/SearchabeInput";
import { Cliente } from "@/types/client";
import { Checkbox } from "@/components/ui/checkbox";

// IMPORTS DE REACT-HOOK-FORM Y ZOD
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCertificado,
  createFitosanitario,
  createMaterial,
  createPlastico,
  generate_pdf,
} from "@/api/destinoFinal";

// Opciones de capacidades en litros para fitosanitarios
const LITROS_OPTIONS = [
  { key: "01", label: "0.1 L" },
  { key: "025", label: "0.25 L" },
  { key: "05", label: "0.5 L" },
  { key: "1", label: "1 L" },
  { key: "2", label: "2 L" },
  { key: "3", label: "3 L" },
  { key: "4", label: "4 L" },
  { key: "5", label: "5 L" },
  { key: "10", label: "10 L" },
  { key: "15", label: "15 L" },
  { key: "20", label: "20 L" },
  { key: "25", label: "25 L" },
  { key: "30", label: "30 L" },
  { key: "60", label: "60 L" },
  { key: "100", label: "100 L" },
  { key: "200", label: "200 L" },
  { key: "TAPAS", label: "Tapas" },
];

/* ------------------------------------------------------------------
   1. Definir esquema de validación con Zod
   ------------------------------------------------------------------ 
   Algunos campos son opcionales o dependen de la categoría:
   - categoria: metales, fibras, plasticos, fitosanitarios
   - client: se define como un object con { id, name, rut, address }
   - cantidades: solo aplica si la categoría es fitosanitarios
   - clasificacionResinas: solo aplica si la categoría es plasticos
   - material: solo aplica si la categoría es metales o fibras
*/
const certificateFormSchema = z.object({
  // Campos generales
  folio: z.string().optional(),
  categoria: z.enum(["metales", "plasticos", "fibras", "fitosanitarios"]),
  certificadoNro: z.string().optional(),
  guiaNro: z.string().optional(),
  destinoFinal: z.string().optional(),
  periodo: z.string().optional(),
  fecha: z.date(), // Added fecha field
  esBasura: z.boolean().optional(),
  // Cliente
  client: z.object({
    id: z.number(),
    name: z.string(),
    rut: z.string(),
    address: z.string(),
  }),

  // Para metales / fibras
  material: z
    .object({
      tipo: z.string().optional(),
      // cantidad debe ser un campo obligatorio
      cantidad: z.string().optional(),
      unidad: z.enum(["KG"]).optional(), // en este ejemplo solo "KG"
    })
    .optional(),

  // Para plásticos
  // debe ser clasificacion_resinas y cantidad_kg

  clasificacionResinas: z.string().optional(),

  // cada cantidad es un number
  cantidades: z
    .object({
      "01": z.number().optional(),
      "025": z.number().optional(),
      "05": z.number().optional(),
      "1": z.number().optional(),
      "2": z.number().optional(),
      "3": z.number().optional(),
      "4": z.number().optional(),
      "5": z.number().optional(),
      "10": z.number().optional(),
      "15": z.number().optional(),
      "20": z.number().optional(),
      "25": z.number().optional(),
      "30": z.number().optional(),
      "60": z.number().optional(),
      "100": z.number().optional(),
      "200": z.number().optional(),
      TAPAS: z.number().optional(),
    })
    .optional(),
});

// Extraemos el tipo en Typescript
type CertificateFormData = z.infer<typeof certificateFormSchema>;

/* ------------------------------------------------------------------
   2. Componente principal
   ------------------------------------------------------------------ */
export interface CertificadoFormProps {
  clients: Cliente[];
  onUpdate: (data: CertificateFormData) => void;
}

export function CertificadoForm({ clients, onUpdate }: CertificadoFormProps) {
  // Para mostrar/ocultar previa, usaremos el diálogo.
  // (Ya no guardamos formData en un useState, sino en react-hook-form)

  const [_, setCategoria] = useState<Categoria>("metales");

  // Inicializamos react-hook-form
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: {
      categoria: "metales",
      cantidades: {}, // Inicializamos cantidades como un objeto vacío
      material: {
        unidad: "KG",
      },
      fecha: new Date(), // Set default to current date
    },
  });

  // Observamos la categoría para mostrar dinámicamente los campos
  const selectedCategory = watch("categoria");

  // Maneja el cambio de categoría y resetea campos según sea necesario
  const handleCategoriaChange = (value: Categoria) => {
    setCategoria(value);
    setValue("categoria", value);

    // Dependiendo de la categoría, puedes resetear campos
    if (value === "plasticos") {
      setValue("clasificacionResinas", "");
      setValue("material", undefined);
      setValue("cantidades", undefined);
    } else if (value === "fitosanitarios") {
      setValue("cantidades", {}); // inicias un objeto vacío
      setValue("material", undefined);
      setValue("clasificacionResinas", undefined);
    } else {
      // metales / fibras
      setValue("material", {
        tipo: "",
        cantidad: "",
        unidad: "KG",
      });
      setValue("clasificacionResinas", undefined);
      setValue("cantidades", undefined);
    }
  };

  // Cuando se selecciona un cliente desde SearchableInput
  const handleClientSelect = (selectedClient: Cliente) => {
    // Actualizamos el campo "client" del formulario
    setValue("client", {
      id: selectedClient.id ?? 0, // Provide a fallback value
      name: selectedClient.name,
      rut: selectedClient.rut,
      address: selectedClient.address ?? "",
    });
  };

  /* ------------------------------------------------------------------
     Lógica final de envío: handleGenerateCertificado
     ------------------------------------------------------------------ 
     En lugar de leer de un state, leemos todo desde `data` 
     proveniente del handleSubmit(onSubmit). 
  */
  const onSubmit = async (data: CertificateFormData) => {
    console.log("esto es data en submit ", data);
    try {
      // 1. Crear el certificado en el backend
      const certificadoData = {
        folio: data.folio || "",
        categoria:
          data.categoria === "plasticos"
            ? "Plásticos"
            : data.categoria === "fibras"
            ? "Fibras"
            : data.categoria === "fitosanitarios"
            ? "Fitosanitarios"
            : "Metales",
        numero_certificado: data.certificadoNro || null,
        client: data.client?.id ?? 1, // fallback: 1
        numero_guia: data.guiaNro || "S/G",
        destino_final: data.destinoFinal || "",
        fecha: data.fecha.toISOString().slice(0, 10), // Format date as YYYY-MM-DD
        esBasura: data.esBasura || false,
      };
      const certificadoCreado = await createCertificado(certificadoData);
      // Guardamos el ID del certificado creado

      const certificadoId = certificadoCreado.id;
      // 2. Crear el detalle según la categoría
      console.log("El id del certificado es: ", certificadoId);

      if (data.categoria === "plasticos") {
        const plasticoData = {
          certificado: certificadoId,
          clasificacion_resinas: data.clasificacionResinas || "",
          cantidad_kg: parseFloat(data.material?.cantidad || "0") || 0,
        };
        await createPlastico(plasticoData);
      } else if (data.categoria === "fitosanitarios") {
        // Convertir cada valor a
        const fitoData = {
          certificado: certificadoId,
          ...LITROS_OPTIONS.reduce((acc, option) => {
            const key = `cantidad_${option.key.toLowerCase()}_l`; // Usamos la clave interna (key)
            acc[key] = parseInt(
              (data.cantidades as Record<string, number>)?.[
                option.key
              ]?.toString() || "0",
              10
            );
            return acc;
          }, {} as Record<string, number>),
        };
        try {
          await createFitosanitario(fitoData);
        } catch (error) {
          console.error("Error al crear fitosanitarios: ", error);
        }
      } else {
        // Metales o Fibras
        const material = {
          certificado: certificadoId,
          material: data.material?.tipo || "",
          cantidad_kg: parseFloat(data.material?.cantidad || "0") || 0,
        };

        await createMaterial(material);
      }

      await generate_pdf(certificadoId); // Generar PDF después de crear el certificado y su detalle
      await onUpdate(data);

      alert("Certificado y detalle creados exitosamente!");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al crear el certificado o el detalle.");
    }
  };
  // Ahora, construimos el formulario con react-hook-form y zod
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Formulario de Certificado</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log(errors);
          })}
          className="space-y-6"
        >
          {/* Fila 1: Folio, Categoría, CertificadoNro */}
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="folio">Folio</Label>
              <Input
                id="folio"
                placeholder="C-25274-24"
                // En caso de un input simple, puedes usar register
                {...register("folio")}
              />
              {errors.folio && (
                <p className="text-red-500 text-sm">{errors.folio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Categoría</Label>
              {/* Para Select usamos Controller para integrarlo con RHF */}
              <Controller
                control={control}
                name="categoria"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val: Categoria) => {
                      field.onChange(val);
                      handleCategoriaChange(val);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metales">Metales</SelectItem>
                      <SelectItem value="plasticos">Plásticos</SelectItem>
                      <SelectItem value="fibras">Fibras</SelectItem>
                      <SelectItem value="fitosanitarios">
                        Fitos Sanitarios
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoria && (
                <p className="text-red-500 text-sm">
                  {errors.categoria.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificadoNro">Número de Certificado</Label>
              <Input id="certificadoNro" {...register("certificadoNro")} />
              {errors.certificadoNro && (
                <p className="text-red-500 text-sm">
                  {errors.certificadoNro.message}
                </p>
              )}
            </div>

            {/* boolean si es basura o no */}
            <div className="space-y-2 flex  items-center mt-8">
              <div className="flex items-center space-x-2">
                <Controller
                  control={control}
                  name="esBasura"
                  render={({ field }) => (
                    <Checkbox
                      id="esBasura"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="esBasura" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Es Basura
                </Label>
              </div>
              {errors.esBasura && (
                <p className="text-red-500 text-sm">{errors.esBasura.message}</p>
              )}
            </div>
          </div>

          {/* Fila 2: Cliente (búsqueda), RUT, Domicilio */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Seleccionar Cliente</Label>
              <Controller
                control={control}
                name="client"
                render={({ field }) => (
                  <SearchableInput
                    items={clients}
                    displayKey="name"
                    onSelect={(selected) => {
                      field.onChange(selected); // actualiza en RHF
                      handleClientSelect(selected); // setea manualmente si lo deseas
                    }}
                  />
                )}
              />
              {errors.client && (
                <p className="text-red-500 text-sm">
                  {/* 
                    errors.client.message no va a existir, 
                    porque "client" es un objeto. 
                    Si quieres mostrar un error (por ej. si es requerido),
                    podrías validar con z.object().refine(...) 
                  */}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rut">RUT</Label>
              {/* Mostramos el valor del client seleccionado */}
              <Input id="rut" disabled value={watch("client")?.rut ?? ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="domicilio">Domicilio</Label>
              <Input
                id="domicilio"
                disabled
                value={watch("client")?.address ?? ""}
              />
            </div>
          </div>

          {/* Metales y Fibras => material_detalle */}
          {selectedCategory !== "fitosanitarios" &&
            selectedCategory !== "plasticos" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material-tipo">Material</Label>
                  <Input id="material-tipo" {...register("material.tipo")} />
                  {errors.material?.tipo && (
                    <p className="text-red-500 text-sm">
                      {errors.material.tipo.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material-cantidad">Cantidad (KG)</Label>
                  <Input
                    id="material-cantidad"
                    type="number"
                    {...register("material.cantidad")}
                  />
                  {errors.material?.cantidad && (
                    <p className="text-red-500 text-sm">
                      {errors.material.cantidad.message}
                    </p>
                  )}
                </div>
              </div>
            )}

          {/* Plásticos => plastico_detalle */}
          {selectedCategory === "plasticos" && (
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="clasificacionResinas">
                  Clasificación Código de Resinas
                </Label>
                <Input
                  id="clasificacionResinas"
                  {...register("clasificacionResinas")}
                />
                {errors.clasificacionResinas && (
                  <p className="text-red-500 text-sm">
                    {errors.clasificacionResinas.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="material-cantidad">Cantidad (KG)</Label>
                <Input
                  id="material-cantidad"
                  type="number"
                  {...register("material.cantidad")}
                />
                {errors.material?.cantidad && (
                  <p className="text-red-500 text-sm">
                    {errors.material.cantidad.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Fitosanitarios => fitosanitario_detalle */}
          {selectedCategory === "fitosanitarios" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Cantidades por Litros</h3>
              <div className="grid grid-cols-6 gap-2">
                {LITROS_OPTIONS.map((option) => (
                  <div key={option.key} className="space-y-1">
                    <Label
                      htmlFor={`cantidad-${option.key}`}
                      className="text-xs"
                    >
                      {option.label} {/* Usamos la etiqueta descriptiva aquí */}
                    </Label>
                    <Controller
                      control={control}
                      name={
                        `cantidades.${option.key}` as keyof CertificateFormData
                      }
                      render={({ field }) => (
                        <Input
                          id={`cantidad-${option.key}`}
                          type="text"
                          value={field.value?.toString() || ""}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            field.onChange(
                              !isNaN(Number(inputValue))
                                ? Number(inputValue)
                                : 0
                            );
                          }}
                          className="h-8 text-sm"
                        />
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fila 3: Nro. Guía, Destino Final, Periodo */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guiaNro">Número de Guía</Label>
              <Input id="guiaNro" placeholder="S/G" {...register("guiaNro")} />
              {errors.guiaNro && (
                <p className="text-red-500 text-sm">{errors.guiaNro.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="destinoFinal">Destino Final</Label>
              <Input id="destinoFinal" {...register("destinoFinal")} />
              {errors.destinoFinal && (
                <p className="text-red-500 text-sm">
                  {errors.destinoFinal.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Controller
                control={control}
                name="fecha"
                render={({ field }) => (
                  <Input
                    id="fecha"
                    type="date"
                    value={field.value.toISOString().split("T")[0]}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                )}
              />
              {errors.fecha && (
                <p className="text-red-500 text-sm">{errors.fecha.message}</p>
              )}
            </div>
          </div>

          {/* Botón + Modal (Preview PDF, etc.) */}
          {/* <Dialog> */}
          {/* <DialogTrigger asChild> */}
          <Button className="w-full" type="submit">
            Generar Certificado
          </Button>
          {/* </DialogTrigger> */}

          {/* <DialogContent className="max-w-3xl"> */}
          {/* 
                Aquí puedes mostrar la previsualización del PDF 
                con los datos que se están watch-eando 
              */}
          {/* <CertificadoPreview data={watch()} /> */}
          {/* </DialogContent> */}
          {/* </Dialog> */}
        </form>
      </CardContent>
    </Card>
  );
}

