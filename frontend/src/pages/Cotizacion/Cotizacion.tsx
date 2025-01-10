"use client";

import { useState, useEffect } from "react";
import { ClientForm } from "./components/Client-form";
import { deleteCotizacion, getCotizaciones } from '@/api/cotizacion';
import { DashTableForm } from '@/components/DashTableForm';
import GenericTable from '@/components/GenericTable';

interface CotizacionTable {
  id: number;
  date_time: string;
  client: string;
  requested_by: string;
  worker: string;
  pdf_cotizacion: string;
}




const COLUMNS_TABLE_CERTIFICATES: { key: keyof CotizacionTable; header: string }[] = [
  { key: 'id', header: 'ID' },
  { key: 'date_time', header: 'Fecha' },
  { key: 'client', header: 'Cliente' },
  { key: 'requested_by', header: 'Solicitante' },
  { key: 'worker', header: 'Atendido' },
  { key: 'pdf_cotizacion', header: 'Descargar' },
]

export default function Page() {
  // Estados principales
  const [certificados, setCertificados] = useState<CotizacionTable[]>([]);


  console.log(certificados);
  const convertTime = (time: string) => {
    const date = new Date(time);
    // fecha con hora
    return date.toLocaleString();
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [certificatesData] = await Promise.all([
          getCotizaciones(),
        ]);


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
    fetchData();
  }, []);


  const onDelete = async (data: CotizacionTable) => {
    try {
      await deleteCotizacion(data.id); // Assuming `id` is a property of `CotizacionTable`
      setCertificados(certificados.filter((certificate) => certificate !== data));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }
 

  return (
    <DashTableForm
    dashboardContent={<div />}
      tableContent={
        <GenericTable
          title="Clientes"
          description="Lista de clientes"
          initialRecords={certificados || []}
          columns={COLUMNS_TABLE_CERTIFICATES}
          onDelete={onDelete}
        />}
      formContent= {<ClientForm/>}

    />
  );
}



