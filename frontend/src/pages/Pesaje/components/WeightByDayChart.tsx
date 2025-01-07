import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { TicketPesaje } from '@/types/pesaje'
import { formatNumber } from './lib/utils'

interface WeightByDayChartProps {
  data: TicketPesaje[]
}

export default function WeightByDayChart({ data }: WeightByDayChartProps) {
  const weightByDay = useMemo(() => {
    const weightData = data.reduce((acc, ticket) => {
      const date = new Date(ticket.fecha)
      const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
      const pesoNeto = Math.abs(parseFloat(ticket.peso_1) - parseFloat(ticket.peso_2))
      if (!acc[formattedDate]) {
        acc[formattedDate] = { date: formattedDate, weight: 0 }
      }
      acc[formattedDate].weight += pesoNeto
      return acc
    }, {} as Record<string, { date: string; weight: number }>)

    return Object.values(weightData)
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split('/').map(Number)
        const [dayB, monthB] = b.date.split('/').map(Number)
        return monthA - monthB || dayA - dayB
      })
      .map(item => ({
        ...item,
        formattedWeight: formatNumber(item.weight),
      }))
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Peso Total por Día en Toneladas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weightByDay}>
            <XAxis 
              dataKey="date" 
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
              formatter={(value) => [`${formatNumber((value as number) / 1000)} ton`, "Peso"]}
              labelFormatter={(label) => `Fecha: ${label}`}
            />
            <Line type="monotone" dataKey="weight" stroke="#82ca9d" name="Peso" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

