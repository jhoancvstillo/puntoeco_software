import { Line, LineChart as RechartsLineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: Array<{ [key: string]: any }>;
  index: string;
  categories: string[];
  colors: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
}

export function LineChart({ data, index, categories, colors, valueFormatter, yAxisWidth = 40 }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsLineChart data={data}>
        <XAxis dataKey={index} />
        <YAxis width={yAxisWidth} tickFormatter={valueFormatter} />
        <Tooltip
          formatter={(value: number, name: string) => [valueFormatter ? valueFormatter(value) : value, name]}
        />
        {categories.map((category, idx) => (
          <Line key={category} type="monotone" dataKey={category} stroke={colors[idx % colors.length]} />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

