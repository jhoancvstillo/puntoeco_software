import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: Array<{ [key: string]: any }>;
  index: string;
  categories: string[];
  colors: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
}

export function BarChart({ data, index, categories, colors, valueFormatter, yAxisWidth = 40 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsBarChart data={data}>
        <XAxis dataKey={index} />
        <YAxis width={yAxisWidth} tickFormatter={valueFormatter} />
        <Tooltip
          formatter={(value: number, name: string) => [valueFormatter ? valueFormatter(value) : value, name]}
        />
        {categories.map((category, idx) => (
          <Bar key={category} dataKey={category} fill={colors[idx % colors.length]} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

