"use client";

import { useState, useEffect } from "react";
import { ClientForm } from "./components/Client-form";
import { deleteCotizacion, getCotizaciones } from "@/api/cotizacion";
import GenericTable from "@/components/GenericTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { createCotizacion } from "@/api/cotizacion";
import { cotizacionFormProps } from "./components/schema";

interface CotizacionTable {
  id: number;
  date_time: string;
  client: string;
  requested_by: string;
  worker: string;
  pdf_cotizacion: string;
}

const COLUMNS_TABLE_CERTIFICATES: {
  key: keyof CotizacionTable;
  header: string;
}[] = [
  { key: "id", header: "ID" },
  { key: "date_time", header: "Fecha" },
  { key: "client", header: "Cliente" },
  { key: "requested_by", header: "Solicitante" },
  { key: "worker", header: "Atendido" },
  { key: "pdf_cotizacion", header: "Descargar" },
];

export default function Page() {
  // Estados principales
  const [certificados, setCertificados] = useState<CotizacionTable[]>([]);
  const [activeTab, setActiveTab] = useState("table");

  const convertTime = (time: string) => {
    const date = new Date(time);
    // fecha con hora
    return date.toLocaleString();
  };

  
    const fetchData = async () => {
      try {
        const [certificatesData] = await Promise.all([getCotizaciones()]);
        setCertificados(
          certificatesData.map((certificate: any) => ({
            id: certificate.id,
            date_time: convertTime(certificate.date_time),
            client: certificate.client.name,
            requested_by: certificate.requested_by,
            worker: certificate.worker.name,
            pdf_cotizacion: certificate.pdf_cotizacion,
          }))
        ); // Asignamos los datos a `certificados`
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

  const onDelete = async (data: CotizacionTable) => {
    try {
      await deleteCotizacion(data.id); // Assuming `id` is a property of `CotizacionTable`
      setCertificados(
        certificados.filter((certificate) => certificate !== data)
      );
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };


  const tabVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  
  const onSubmit = async (data: cotizacionFormProps) => {
    try{
      await createCotizacion(data);
      const newdata = await fetchData();
      console.log("Data created:", newdata);
    }
    catch (error) {
      console.error("Error creating data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  

  return (
    <Tabs
      defaultValue="table"
      className="w-full"
      onValueChange={setActiveTab}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="table">Tabla</TabsTrigger>
        <TabsTrigger value="form">Formulario</TabsTrigger>
      </TabsList>
      <Card className="mt-4">
        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="visible"
              variants={tabVariants}
            >
              {activeTab === "table" && (
                <GenericTable
                  title="Clientes"
                  description="Lista de clientes"
                  initialRecords={certificados || []}
                  columns={COLUMNS_TABLE_CERTIFICATES}
                  onDelete={onDelete}
                />
              )}

              {activeTab === "form" && <ClientForm onSubmit={onSubmit} />}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </Tabs>
  );
}
