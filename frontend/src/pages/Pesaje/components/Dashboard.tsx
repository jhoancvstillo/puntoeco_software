import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketPesaje } from '@/types/pesaje';
import { formatNumber, formatDate } from './lib/utils';
import { calculateStatistics } from './lib/statistics';
import ProductDistributionChart from './ProductDistributionChart';
import WeightByDayChart from './WeightByDayChart';
import TotalWeightByClientChart from './TotalWeightByClientChart';

interface DashboardProps {
  data: TicketPesaje[];
}

export function Dashboard({ data }: DashboardProps) {
  const stats = useMemo(() => calculateStatistics(data), [data]);

  return (
    <div className=" space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <StatCard
          title="Total de Tickets"
          value={stats.totalTickets}
          description="Pesajes realizados"
        />
        <StatCard
          title="Cliente Principal"
          value={stats.topClient.name}
          description={`${formatNumber(stats.topClient.totalWeight)} kg vendidos`}
        />
        <StatCard
          title="Producto Más Vendido"
          value={stats.topProduct.code}
          description={`${formatNumber(stats.topProduct.totalWeight)} kg vendidos`}
        />
        <StatCard
            title="Día Más Activo"
            value={formatDate(stats.mostActiveDay.date)}
            description={`${stats.mostActiveDay.count} pesajes`}
            />
        <StatCard

            title="Promedio de Viajes por Día"
            value={stats.averageTripsPerDay.toFixed(2)}
            description="viajes por día"
            />
        <StatCard
            title="Camiones Más Frecuentes"
            value={
              // avoid undefined
              stats.topTrucks[0]?.type || "No hay datos"
            }
            description={`${stats.topTrucks[0]?.visits} visitas`}
            />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProductDistributionChart data={data} />
        <WeightByDayChart data={data} />
        <TotalWeightByClientChart data={data} />
      </div>


    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
}

function StatCard({ title, value, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xm font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

