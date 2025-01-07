import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie, PieChart, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { FuelRecord } from '../types/fuel'

interface ProviderAnalysisProps {
  records: FuelRecord[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function ProviderAnalysis({ records }: ProviderAnalysisProps) {
  const providerData = useMemo(() => {
    const data = records.reduce((acc, record) => {
      if (!acc[record.card]) {
        acc[record.card] = { name: record.card, value: 0 }
      }
      acc[record.card].value += record.total_invoice
      return acc
    }, {} as Record<string, { name: string; value: number }>)

    return Object.values(data)
  }, [records])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis por Proveedor</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={providerData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {providerData.map((_,index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

