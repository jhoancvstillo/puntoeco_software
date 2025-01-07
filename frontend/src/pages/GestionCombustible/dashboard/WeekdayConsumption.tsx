import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Combustible } from '@/types/combustible'
import { formatCLP, formatNumber } from '@/utils/CurrencyFormatter'

interface WeekdayConsumptionProps {
  records: Combustible[]
}

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default function WeekdayConsumption({ records }: WeekdayConsumptionProps) {
  const weekdayData = useMemo(() => {
    const consumption = records.reduce((acc, record) => {
      const day = new Date(record.fecha).getDay()
      if (!acc[day]) {
        acc[day] = { day: DAYS[day], liters: 0, cost: 0 }
      }
      acc[day].liters += parseFloat(record.litros) || 0
      acc[day].cost += parseFloat(record.total) || 0
      return acc
    }, {} as Record<number, { day: string; liters: number; cost: number }>)

    return Object.values(consumption)
      .sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day))
      .map(item => ({
        ...item,
        formattedLiters: formatNumber(item.liters),
        formattedCost: formatCLP(item.cost),
      }))
  }, [records])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumo por Día de la Semana</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weekdayData}>
            <XAxis 
              dataKey="day" 
              angle={-45}
              textAnchor="end"
              height={60}
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
              labelFormatter={(label) => `Día: ${label}`}
            />
            <Bar 
              yAxisId="left" 
              dataKey="liters" 
              fill="#8884d8" 
              name="Litros" 
            />
            <Bar 
              yAxisId="right" 
              dataKey="cost" 
              fill="#82ca9d" 
              name="Costo" 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
