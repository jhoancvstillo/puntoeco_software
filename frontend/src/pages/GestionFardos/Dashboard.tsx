import { useEffect, useState } from "react";
import { getProductions, getDebts, getDispatches } from "@/api/fardos";
import { Debt, Dispatch, Production } from "./types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddBalesForm from "./forms/AddBalesForm";
import DebtForm from "./forms/DebtForm";
import DispatchForm from "./forms/DispatchForm";
import { HistoryTable } from "./HistoryTable";
import { formatNumber, formatNumberNoDecimals } from "@/utils/formatNumber";

export default function Dashboard() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fardosData, deudasData, enviosData] = await Promise.all([
          getProductions(),
          getDebts(),
          getDispatches(),
        ]);
        setProductions(fardosData);
        setDebts(deudasData);
        setDispatches(enviosData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Lógica para calcular las estadísticas
  const totalBales =
    productions.reduce((sum, p) => sum + p.bales, 0) -
    dispatches.reduce((sum, d) => sum + d.bales, 0);
  const estimatedWeight =
    productions.reduce((sum, p) => sum + p.estimated_weight, 0) -
    dispatches.reduce((sum, d) => sum + d.weight, 0);
  const pendingDebt = debts.reduce((sum, d) => sum + d.pending_weight, 0);
  const kilosInformados = debts.reduce((sum, d) => sum + d.reported_weight, 0);
  const lastDispatch = dispatches[dispatches.length - 1] || {
    bales: 0,
    weight: 0,
  };

  const summaryCards = [
    {
      title: "Fardos en Patio",
      value: formatNumberNoDecimals(totalBales),
      subvalue: `${formatNumber(estimatedWeight)} kg`,
    },
    {
      title: "Último Despacho",
      value: formatNumberNoDecimals(lastDispatch.bales),
      subvalue: `${formatNumber(lastDispatch.weight)} kg`,
    },
    {
      title: "Kilos Informados",
      value: `${formatNumber(kilosInformados)} kg`,
    },
    {
      title: "Kilos Pendientes",
      value: `${formatNumber(pendingDebt)} kg`,
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
              {card.subvalue && (
                <p className="text-sm text-muted-foreground">{card.subvalue}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="historial" className="w-full">
        <TabsList className="w-full">
          <div className="flex w-full">
            <TabsTrigger value="historial" className="flex-1">
              Historial
            </TabsTrigger>
            <TabsTrigger value="fardos" className="flex-1">
              Agregar Fardos
            </TabsTrigger>
            <TabsTrigger value="deuda" className="flex-1">
              Agregar Deuda
            </TabsTrigger>
            <TabsTrigger value="envio" className="flex-1">
              Agregar Envío
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="historial">
          <HistoryTable />
        </TabsContent>
        <TabsContent value="fardos">
          <AddBalesForm />
        </TabsContent>
        <TabsContent value="deuda">
          <DebtForm />
        </TabsContent>
        <TabsContent value="envio">
          <DispatchForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
