import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Combustible } from '@/types/combustible'
import { formatCLP, formatNumber } from '@/utils/CurrencyFormatter'
import { formatDate } from '@/utils/DateFormatter'

interface DateAnalysisProps {
  records: Combustible[]
}

export default function DateAnalysis({ records }: DateAnalysisProps) {
  const dailyConsumption = useMemo(() => {
    const consumption = records.reduce((acc, record) => {
      const date = record.fecha
      if (!acc[date]) {
        acc[date] = { date, liters: 0, cost: 0 }
      }
      acc[date].liters += parseFloat(record.litros) || 0
      acc[date].cost += parseFloat(record.total) || 0
      return acc
    }, {} as Record<string, { date: string; liters: number; cost: number }>)

    return Object.values(consumption)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(item => ({
        ...item,
        formattedDate: formatDate(item.date),
        formattedLiters: formatNumber(item.liters),
        formattedCost: formatCLP(item.cost),
      }))
  }, [records])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis por Fecha</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyConsumption}>
            <XAxis 
              dataKey="formattedDate" 
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              stroke="#8884d8"
              tickFormatter={(value) => formatNumber(value)}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#82ca9d"
              tickFormatter={(value) => formatCLP(value)}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === "Litros") return [formatNumber(value as number), name]
                if (name === "Costo") return [formatCLP(value as number), name]
                return [value, name]
              }}
              labelFormatter={(label) => `Fecha: ${label}`}
            />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="liters" 
              stroke="#8884d8" 
              name="Litros" 
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="cost" 
              stroke="#82ca9d" 
              name="Costo" 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
