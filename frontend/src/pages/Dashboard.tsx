import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, BarChart, LineChart, PieChart, Area, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Layout } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard: React.FC = () => {
  // Datos ficticios para los gráficos (mantenidos igual que antes)
  const monthlyRecyclingData = [
    { month: 'Ene', plastico: 1200, papel: 1800, vidrio: 900, metal: 600 },
    { month: 'Feb', plastico: 1400, papel: 1600, vidrio: 950, metal: 700 },
    { month: 'Mar', plastico: 1300, papel: 1900, vidrio: 1000, metal: 800 },
    { month: 'Abr', plastico: 1500, papel: 2000, vidrio: 1100, metal: 750 },
    { month: 'May', plastico: 1600, papel: 2100, vidrio: 1050, metal: 800 },
    { month: 'Jun', plastico: 1800, papel: 2200, vidrio: 1200, metal: 900 },
  ];

  const recyclingCompositionData = [
    { name: 'Plástico', value: 35 },
    { name: 'Papel', value: 40 },
    { name: 'Vidrio', value: 15 },
    { name: 'Metal', value: 10 },
  ];

  const carbonFootprintData = [
    { month: 'Ene', emision: 50 },
    { month: 'Feb', emision: 48 },
    { month: 'Mar', emision: 45 },
    { month: 'Abr', emision: 42 },
    { month: 'May', emision: 40 },
    { month: 'Jun', emision: 38 },
  ];

  const customerSatisfactionData = [
    { month: 'Ene', satisfaccion: 85 },
    { month: 'Feb', satisfaccion: 87 },
    { month: 'Mar', satisfaccion: 89 },
    { month: 'Abr', satisfaccion: 88 },
    { month: 'May', satisfaccion: 90 },
    { month: 'Jun', satisfaccion: 92 },
  ];

  const energyConsumptionData = [
    { month: 'Ene', consumo: 1200 },
    { month: 'Feb', consumo: 1150 },
    { month: 'Mar', consumo: 1100 },
    { month: 'Abr', consumo: 1050 },
    { month: 'May', consumo: 1000 },
    { month: 'Jun', consumo: 950 },
  ];

  const recyclingEfficiencyData = [
    { material: 'Plástico', eficiencia: 75 },
    { material: 'Papel', eficiencia: 85 },
    { material: 'Vidrio', eficiencia: 90 },
    { material: 'Metal', eficiencia: 80 },
  ];

  const communityImpactData = [
    { categoria: 'Empleos creados', valor: 50 },
    { categoria: 'Programas educativos', valor: 15 },
    { categoria: 'Eventos comunitarios', valor: 30 },
    { categoria: 'Donaciones', valor: 25 },
  ];

  const wasteReductionData = [
    { year: '2018', reduccion: 10 },
    { year: '2019', reduccion: 15 },
    { year: '2020', reduccion: 22 },
    { year: '2021', reduccion: 28 },
    { year: '2022', reduccion: 35 },
    { year: '2023', reduccion: 40 },
  ];

  const revenueStreamData = [
    { stream: 'Venta de materiales reciclados', porcentaje: 60 },
    { stream: 'Servicios de consultoría', porcentaje: 20 },
    { stream: 'Programas educativos', porcentaje: 10 },
    { stream: 'Otros', porcentaje: 10 },
  ];

  const supplierPerformanceData = [
    { proveedor: 'Proveedor A', puntualidad: 90, calidad: 85 },
    { proveedor: 'Proveedor B', puntualidad: 85, calidad: 88 },
    { proveedor: 'Proveedor C', puntualidad: 92, calidad: 90 },
    { proveedor: 'Proveedor D', puntualidad: 88, calidad: 87 },
  ];

  // Definición del layout inicial
  const [layout, setLayout] = useState(() => {
    const savedLayout = localStorage.getItem('dashboardLayout');
    return savedLayout ? JSON.parse(savedLayout) : [
      { i: 'monthlyRecycling', x: 0, y: 0, w: 6, h: 2 },
      { i: 'recyclingComposition', x: 6, y: 0, w: 6, h: 2 },
      { i: 'carbonFootprint', x: 0, y: 2, w: 6, h: 2 },
      { i: 'customerSatisfaction', x: 6, y: 2, w: 6, h: 2 },
      { i: 'energyConsumption', x: 0, y: 4, w: 6, h: 2 },
      { i: 'recyclingEfficiency', x: 6, y: 4, w: 6, h: 2 },
      { i: 'communityImpact', x: 0, y: 6, w: 6, h: 2 },
      { i: 'wasteReduction', x: 6, y: 6, w: 6, h: 2 },
      { i: 'revenueStream', x: 0, y: 8, w: 6, h: 2 },
      { i: 'supplierPerformance', x: 6, y: 8, w: 6, h: 2 },
    ];
  });

  const onLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
    localStorage.setItem('dashboardLayout', JSON.stringify(newLayout));
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dashboardLayout') {
        const newLayout = e.newValue ? JSON.parse(e.newValue) : null;
        if (newLayout) {
          setLayout(newLayout);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="p-4">
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={150}
        onLayoutChange={onLayoutChange}
      >
        <div key="monthlyRecycling">
          <Card>
            <CardHeader>
              <CardTitle>Volumen de Reciclaje Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={monthlyRecyclingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="plastico" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="papel" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  <Area type="monotone" dataKey="vidrio" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  <Area type="monotone" dataKey="metal" stackId="1" stroke="#ff7300" fill="#ff7300" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div key="recyclingComposition">
          <Card>
            <CardHeader>
              <CardTitle>Composición del Reciclaje</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie dataKey="value" data={recyclingCompositionData} fill="#8884d8" label />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div key="carbonFootprint">
          <Card>
            <CardHeader>
              <CardTitle>Huella de Carbono</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={carbonFootprintData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="emision" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div key="customerSatisfaction">
          <Card>
            <CardHeader>
              <CardTitle>Satisfacción del Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={customerSatisfactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="satisfaccion" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div key="energyConsumption">
          <Card>
            <CardHeader>
              <CardTitle>Consumo de Energía</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={energyConsumptionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="consumo" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div key="recyclingEfficiency">
          <Card>
            <CardHeader>
              <CardTitle>Eficiencia de Reciclaje por Material</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={recyclingEfficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="material" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="eficiencia" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div key="communityImpact">
          <Card>
            <CardHeader>
              <CardTitle>Impacto Comunitario</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie dataKey="valor" data={communityImpactData} fill="#ffc658" label />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div key="wasteReduction">
          <Card>
            <CardHeader>
              <CardTitle>Reducción de Residuos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={wasteReductionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="reduccion" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div key="revenueStream">
          <Card>
            <CardHeader>
              <CardTitle>Fuentes de Ingresos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie dataKey="porcentaje" data={revenueStreamData} fill="#82ca9d" label />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div key="supplierPerformance">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento de Proveedores</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={supplierPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="proveedor" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="puntualidad" fill="#8884d8" />
                  <Bar dataKey="calidad" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default Dashboard;

