import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Combustible } from '@/types/combustible'
import { formatCLP, formatNumber } from '@/utils/CurrencyFormatter'

interface VehicleAnalysisProps {
  records: Combustible[]
}

export default function VehicleAnalysis({ records }: VehicleAnalysisProps) {
  const vehicleData = useMemo(() => {
    const data = records.reduce((acc, record) => {
      if (!acc[record.patente]) {
        acc[record.patente] = {
          licensePlate: record.patente,
          liters: parseFloat(record.litros) || 0,
          cost: parseFloat(record.total) || 0,
          transactions: 0,
        }
      }
      acc[record.patente].liters += parseFloat(record.litros) || 0
      acc[record.patente].cost += parseFloat(record.total) || 0
      acc[record.patente].transactions += 1
      return acc
    }, {} as Record<string, { licensePlate: string; liters: number; cost: number; transactions: number }>)

    return Object.values(data)
      .sort((a, b) => b.liters - a.liters)
      .map(item => ({
        ...item,
        formattedLiters: formatNumber(item.liters),
        formattedCost: formatCLP(item.cost),
      }))
  }, [records])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis por Vehículo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={vehicleData}>
            <XAxis 
              dataKey="licensePlate" 
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
                if (name === "Litros") return [formatNumber(value as number), name];
                if (name === "Costo") return [formatCLP(value as number), name];
                return [value, name];
              }}
              labelFormatter={(label) => `Patente: ${label}`}
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
