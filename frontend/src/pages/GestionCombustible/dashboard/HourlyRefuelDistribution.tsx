import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Combustible } from '@/types/combustible'

interface HourlyRefuelDistributionProps {
  records: Combustible[]
}

export default function HourlyRefuelDistribution({ records }: HourlyRefuelDistributionProps) {
  const hourlyData = useMemo(() => {
    // Inicializa un objeto con todas las horas del día
    const distribution = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: 0,
      formattedHour: `${i.toString().padStart(2, '0')}:00`
    }));

    records.forEach(record => {
      if (record.hora) {
        const [hours] = record.hora.split(':');
        const hour = parseInt(hours, 10);
        if (hour >= 0 && hour < 24) {
          distribution[hour].count += 1;
        }
      }
    });

    return distribution;
  }, [records]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Recargas por Hora del Día</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hourlyData}>
            <XAxis 
              dataKey="formattedHour" 
              interval={2} 
              angle={-45} 
              textAnchor="end" 
              height={50}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => [value, 'Número de Recargas']}
              labelFormatter={(label) => `Hora: ${label}`}
            />
            <Bar dataKey="count" fill="#8884d8" name="Número de Recargas" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
