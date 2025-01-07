import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { TicketPesaje } from '@/types/pesaje'
import { formatNumber } from './lib/utils'

interface ProductDistributionChartProps {
  data: TicketPesaje[]
}

export default function ProductDistributionChart({ data }: ProductDistributionChartProps) {
  const productDistribution = useMemo(() => {
    const distribution = data.reduce((acc, ticket) => {
      const pesoNeto = Math.abs(parseFloat(ticket.peso_1) - parseFloat(ticket.peso_2))
      if (!acc[ticket.codigo_producto]) {
        acc[ticket.codigo_producto] = { product: ticket.codigo_producto, weight: 0, percentage: 0 }
      }
      acc[ticket.codigo_producto].weight += pesoNeto
      return acc
    }, {} as Record<string, { product: string; weight: number; percentage: number }>)

    const totalWeight = Object.values(distribution).reduce((sum, item) => sum + item.weight, 0)

    return Object.values(distribution)
      .map(item => ({
        ...item,
        // percentage must have 2 decimals
        percentage: parseFloat(((item.weight / totalWeight) * 100).toFixed(2)),
        formattedWeight: formatNumber(item.weight),
      }))
      .sort((a, b) => b.percentage - a.percentage)
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Productos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}> 
          <BarChart data={productDistribution}>
            <XAxis 
              dataKey="product" 
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `${value.toFixed(2)}%`}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === "percentage") return [`${(value as number).toFixed(2)}%`, "Porcentaje"]
                if (name === "weight") return [formatNumber(value as number), "Peso (kg)"]
                return [value, name]
              }}
              labelFormatter={(label) => `Producto: ${label}`}
            />
            <Bar dataKey="percentage" fill="#8884d8" name="Porcentaje" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

