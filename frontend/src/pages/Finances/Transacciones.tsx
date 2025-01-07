"use client";

import { useState, useEffect } from "react";
import { TransactionForm } from "./components/TransactionForm";
import { TransactionTable } from "./components/TransactionTable";
import { ClassificationManager } from "./components/ClassificationMananger";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Transaction, Classification, Subcategory } from "@/types/finance";
import {
  getTransactions,
  deleteTransaction,
  getClassifications,
  getSubcategories,
} from "@/api/finanzas";

export default function FinanceManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("transactions");

  useEffect(() => {
    fetchTransactions();
    fetchClassifications();
    fetchSubcategories();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
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

  const handleDeleteTransaction = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta transacción?")) {
      try {
        await deleteTransaction(id);
        setTransactions(transactions.filter((t) => t.id !== id));
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

  const handleTransactionSubmit = () => {
    // Cierra el diálogo y recarga transacciones
    setIsDialogOpen(false);
    fetchTransactions();
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
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsDialogOpen(true)}>Agregar Transacción</Button>
          </div>
          <TransactionTable transactions={transactions} onDelete={handleDeleteTransaction} />
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

      {/* Diálogo para agregar Transacción */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nueva Transacción</DialogTitle>
          </DialogHeader>
          <TransactionForm
            onSubmit={handleTransactionSubmit}
            classifications={classifications}
            subcategories={subcategories}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
