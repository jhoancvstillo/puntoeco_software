import { useEffect, useState } from 'react';
import { getProductions, getDispatches, getDebts, deleteProduction, deleteDispatch, deleteDebt } from '@/api/fardos';
import GenericTable from '@/components/GenericTable';
import { Spinner } from '@/components/Spinner';

interface CombinedHistoryEntry {
  id: number;
  date: string;
  type: string;
  bales: number;
  estimatedWeight: number;
  weight: number;
  destination: string;
  reported_weight: number;
  accepted_weight: number;
  pending_weight: number;
}

const COLUMNS_TABLE_HISTORY: Array<{ key: keyof CombinedHistoryEntry; header: string }> = [
  { key: 'date', header: 'Fecha' },
  { key: 'type', header: 'Tipo' },
  { key: 'bales', header: 'Fardos' },
  { key: 'estimatedWeight', header: 'Peso Estimado (kg)' },
  { key: 'reported_weight', header: 'Reportado' },
  { key: 'accepted_weight', header: 'Aceptado' },
  { key: 'pending_weight', header: 'Pendiente' },
  { key: 'destination', header: 'Destino' },
];

export function HistoryTable() {
  const [combinedHistory, setCombinedHistory] = useState<CombinedHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const production = await getProductions();
        const dispatches = await getDispatches();
        const debt = await getDebts();
        console.log('Production:', production);
        console.log('Dispatches:', dispatches);
        console.log('Debt:', debt);
        const combined = [
          ...production.map((p: any) => ({ ...p, type: 'Producción' })),
          ...dispatches.map((d: any) => ({ ...d, type: 'Despacho' })),
          ...debt.map((d: any) => ({ ...d, type: 'Deuda' })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setCombinedHistory(combined);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, []);

  const formatCombinedHistory = (combinedHistory: any) => {
    return combinedHistory.map((entry: any) => {
      const {id, date, type, bales, estimated_weight, weight, destination, reported_weight, accepted_weight, pending_weight } = entry;
      return {
        id,
        date,
        type,
        bales: bales || 0,
        estimatedWeight: estimated_weight || 0,
        weight: weight || 0,
        destination: destination || '-',
        reported_weight: reported_weight || 0,
        accepted_weight: accepted_weight || 0,
        pending_weight: pending_weight || 0,
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="w-8 h-8" />
      </div>
    );
    }

  const handleDelete = async (data : CombinedHistoryEntry) => {
    try {
      console.log('Data:', data);
      if (data.type === 'Producción' && data.id !== undefined) {
        await deleteProduction(data.id);
      } else if (data.type === 'Despacho' && data.id !== undefined) {
        await deleteDispatch(data.id);
      } else if (data.type === 'Deuda' && data.id !== undefined) {
        console.log('Deleting debt:', data.id);
        await deleteDebt(data.id);
      }
      
      setCombinedHistory(combinedHistory.filter((entry) => entry.id !== data.id));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  }

  console.log('Combined history:', formatCombinedHistory(combinedHistory));
  return (
    <GenericTable
      initialRecords={formatCombinedHistory(combinedHistory)}
      columns={COLUMNS_TABLE_HISTORY}
      title="Historial de Fardos"
      description="Historial de fardos producidos, despachados y pendientes."
      onDelete={handleDelete}
    />
  );
}
