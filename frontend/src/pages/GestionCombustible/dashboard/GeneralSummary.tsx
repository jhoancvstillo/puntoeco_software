import { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Combustible } from '@/types/combustible';
import { formatCLP, formatNumber } from '@/utils/CurrencyFormatter';

interface GeneralSummaryProps {
  records: Combustible[];
}

export default function GeneralSummary({ records }: GeneralSummaryProps) {
  console.log(records);
  const summary = useMemo(() => {
    const totalLiters = records.reduce((sum, record) => sum + parseFloat(record.litros || "0"), 0);
    const totalSpent = records.reduce((sum, record) => sum + parseFloat(record.total || "0"), 0);
    const avgPricePerLiter = totalLiters > 0 ? totalSpent / totalLiters : 0;

    return {
      totalLiters: formatNumber(totalLiters),
      totalSpent: formatCLP(totalSpent),
      avgPricePerLiter: formatCLP(avgPricePerLiter)
    };
  }, [records]);

  return (
    <Card>
    
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Total Litros Consumidos</h3>
          <p className="text-3xl font-bold">{summary.totalLiters} L</p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">Total Gastado</h3>
          <p className="text-3xl font-bold">{summary.totalSpent}</p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">Precio Promedio por Litro</h3>
          <p className="text-3xl font-bold">{summary.avgPricePerLiter}/L</p>
        </div>
      </CardContent>
    </Card>
  );
}