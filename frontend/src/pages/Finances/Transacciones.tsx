"use client";

import { useState, useEffect } from "react";
import { ClassificationManager } from "./components/ClassificationMananger";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Transaction, Classification, Subcategory } from "@/types/finance";
import {
  getTransactions,
  deleteTransaction,
  getClassifications,
  getSubcategories,
} from "@/api/finanzas";
import GenericTable from "@/components/GenericTable";
import { useTableStore } from "../tableStore";


export default function FinanceManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [activeTab, setActiveTab] = useState("transactions");
  const refresh = useTableStore((state) => state.refreshTable1);

  useEffect(() => {
    console.log("se hizo trigger", refresh)
    fetchTransactions();
    fetchClassifications();
    fetchSubcategories();
  }, [refresh]);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
  
      setTransactions(
        data.map((transaction : Transaction) => ({
          id: transaction.id,
          date: transaction.date_time.split('T')[0] + ' ' + transaction.date_time.split('T')[1].split('Z')[0],
          classification: transaction.classification.name,
          subcategory: transaction.subcategory.name,
          description: transaction.comment,
          amount: transaction.price,
        }))
      );
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: "Failed to load transactions.",
        variant: "destructive",
      });
    }
  };

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

  const handleDeleteTransaction = async (transaction: Transaction) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta transacción?")
    ) {
      try {
        await deleteTransaction(Number(transaction.id));
        setTransactions(transactions.filter((t) => t.id !== transaction.id));
        toast({
          title: "Success",
          description: "Transaction deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting transaction:", error);
        toast({
          title: "Error",
          description: "Failed to delete transaction.",
          variant: "destructive",
        });
      }
    }
  };

 

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transacciones</TabsTrigger>
          <TabsTrigger value="classifications">Clasificaciones</TabsTrigger>
          <TabsTrigger value="subcategories">Subcategorías</TabsTrigger>
        </TabsList>

        {/* Pestaña de Transacciones */}
        <TabsContent value="transactions">
        
         
          <GenericTable
            initialRecords={transactions}
            columns={[
              { key: "id", header: "ID" },
              { key: "date", header: "Fecha" },
              { key: "description", header: "Descripción" },
              { key: "classification", header: "Clasificación" },
              { key: "subcategory", header: "Subcategoría" },
              { key: "amount", header: "Valor" },
            ]}
            title="Transacciones"
            description="Descripción de las transacciones"
            onDelete={handleDeleteTransaction}
          />
        </TabsContent>

        {/* Pestaña de Clasificaciones */}
        <TabsContent value="classifications">
          <ClassificationManager
            type="classification"
            items={classifications}
            onUpdate={fetchClassifications}
          />
        </TabsContent>

        {/* Pestaña de Subcategorías */}
        <TabsContent value="subcategories">
          <ClassificationManager
            type="subcategory"
            items={subcategories}
            onUpdate={fetchSubcategories}
            /** Pasamos las clasificaciones para poder escoger a cuál pertenecen */
            classifications={classifications}
          />
        </TabsContent>
      </Tabs>

    </div>
  );
}
