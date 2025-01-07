import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { TicketPesaje } from '@/types/pesaje'
import { formatNumber } from './lib/utils'

interface TotalWeightByClientChartProps {
  data: TicketPesaje[]
}

export default function TotalWeightByClientChart({ data }: TotalWeightByClientChartProps) {
  const clientWeights = useMemo(() => {
    const weights: Record<string, number> = {}
    data.forEach(ticket => {
      const pesoNeto = Math.abs(parseFloat(ticket.peso_1) - parseFloat(ticket.peso_2))
      if (!weights[ticket.cliente.name]) {
        weights[ticket.cliente.name] = 0
      }
      weights[ticket.cliente.name] += pesoNeto
    })

    return Object.entries(weights)
      .map(([client, weight]) => ({ client, weight }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5)
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Peso Total por Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={clientWeights}>
            <XAxis 
              dataKey="client" 
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `${formatNumber(value / 1000)} ton`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => [`${formatNumber((value as number) / 1000)} ton`, "Peso Total"]}
              labelFormatter={(label) => `Cliente: ${label}`}
            />
            <Bar dataKey="weight" fill="#8884d8" name="Peso Total" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

