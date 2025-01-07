import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { VertederoData } from "../types/Vertedero";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { isWithinInterval, format } from "date-fns";
// import { DateRange } from "@/components/ui/date-range-picker";
import { es } from "date-fns/locale";
import { formatNumber, formatCLP } from "@/utils/CurrencyFormatter";


export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
  onSelect: (range: DateRange | undefined) => void;
}


interface DashboardProps {
  data: VertederoData[];
}

export default function Dashboard({ data }: DashboardProps) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1),
    to: new Date(),
  });
  console.log("Data recibida:", data);

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) {
      return []; // Retorna un array vacío si `data` no es un array
    }
    return data
      .filter((record) => {
        const recordDate = new Date(record.date);
        return isWithinInterval(recordDate, { start: dateRange.from, end: dateRange.to });
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((record) => ({
        ...record,
        formattedDate: format(new Date(record.date), "dd/MM/yyyy", { locale: es }),
      }));
  }, [data, dateRange]);

  console.log("los records son: " + filteredData);  
  const totalWeightKg = useMemo(() => filteredData.reduce((sum, record) => sum + parseFloat(record.weight_kg.toString()), 0), [filteredData]);
  const totalValue = useMemo(() => filteredData.reduce((sum, record) => sum + parseFloat(record.value.toString()), 0), [filteredData]);


  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          transform="rotate(-45)"
          style={{ fontSize: "12px" }}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  const minMaxValues = useMemo(() => {
    if (filteredData.length === 0) {
      return { minWeight: 0, maxWeight: 0, minValue: 0, maxValue: 0 };
    }
    const weights = filteredData.map(record => parseFloat(record.weight_kg.toString()));
    const values = filteredData.map(record => parseFloat(record.value.toString()));
    return {
      minWeight: Math.min(...weights),
      maxWeight: Math.max(...weights),
      minValue: Math.min(...values),
      maxValue: Math.max(...values),
    };
  }, [filteredData]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <DateRangePicker
          from={dateRange.from}
          to={dateRange.to}
          onSelect={(range) => setDateRange(range as { from: Date; to: Date })}
        />
        {/* <Button onClick={handleExport}>Exportar Datos</Button> */}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Peso Total (kg)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatNumber(totalWeightKg)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCLP(totalValue)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Totales Diarios</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" height={60} tick={<CustomXAxisTick />} interval="preserveStartEnd" />
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
                  formatter={(value, name) =>
                    name === "Peso (kg)" ? [formatNumber(value as number), "kg"] : [formatCLP(value as number), "CLP"]
                  }
                />
                <Legend />
                <Bar yAxisId="left" dataKey="weight_kg" fill="#8884d8" name="Peso (kg)" />
                <Bar yAxisId="right" dataKey="value" fill="#82ca9d" name="Valor" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
  <CardHeader>
    <CardTitle>Evolución Diaria</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={300}>
      {filteredData.length > 0 ? (
        <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="formattedDate" 
            height={60} 
            tick={<CustomXAxisTick />} 
            interval="preserveStartEnd" 
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#8884d8"
            tickFormatter={(value) => formatNumber(value)}
            domain={[minMaxValues.minWeight, minMaxValues.maxWeight]}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#82ca9d"
            tickFormatter={(value) => formatCLP(value)}
            domain={[minMaxValues.minValue, minMaxValues.maxValue]}
          />
          <Tooltip
            formatter={(value, name) =>
              name === "Peso (kg)" ? [formatNumber(value as number), "kg"] : [formatCLP(value as number), "CLP"]
            }
          />
          <Legend />
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="weight_kg" 
            stroke="#8884d8" 
            name="Peso (kg)" 
            dot={{ r: 3 }} 
            activeDot={{ r: 5 }} 
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="value" 
            stroke="#82ca9d" 
            name="Valor" 
            dot={{ r: 3 }} 
            activeDot={{ r: 5 }} 
          />
        </LineChart>
      ) : (
        <p>No hay datos disponibles para el rango seleccionado.</p>
      )}
    </ResponsiveContainer>
  </CardContent>
</Card>

      </div>
    </div>
  );
}
