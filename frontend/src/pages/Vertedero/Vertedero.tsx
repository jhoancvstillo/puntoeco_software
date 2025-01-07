"use client";

import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import RecordForm from "./components/RecordForm";
import { VertederoData, VertederoDataForm } from "./types/Vertedero";

import { DashTableForm } from "@/components/DashTableForm";
import { getVertederoRecords, createVertederoRecord, deleteVertederoRecord } from "@/api/vertedero";
import GenericTable from "@/components/GenericTable";

const COLUMNS_TABLE_CERTIFICATES: { key: keyof VertederoData; header: string }[] = [
  { key: "date", header: "Fecha" },
  { key: "weight_kg", header: "Peso" },
  { key: "value", header: "Valor" },
];

export default function VertederoDashboard() {
  const [data, setData] = useState<VertederoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const records = await getVertederoRecords();
        setData(records || []); // Asegurar un arreglo vacío si la API devuelve undefined o null
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNewRecord = async (newRecord: VertederoDataForm) => {
    try {
      const createdRecord = await createVertederoRecord(newRecord);
      setData((prevData) => [...prevData, createdRecord]);
    } catch (error) {
      console.error("Error creating new record:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data.length) {
    return <div>No hay registros disponibles.</div>;
  }


  const handleDelete = async (data: VertederoData) => {
    try {
      // Delete record
      await deleteVertederoRecord(data.id);
      // Update state
      setData((prevData) => prevData.filter((record) => record.id !== data.id));
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  }

  console.log(data);
  return (
    <DashTableForm
      dashboardContent={<Dashboard data={data}/>}
      tableContent={<GenericTable
        initialRecords={data}
        columns={COLUMNS_TABLE_CERTIFICATES}
        title="Registros de Vertedero"
        description="Listado de los registros de vertedero existentes."
        onDelete={handleDelete}
      />}

      formContent={<RecordForm onSubmit={handleNewRecord} />}
    />
  );
}
