import { TicketPesaje } from '@/types/pesaje';

export function calculateStatistics(data: TicketPesaje[]) {
  const totalTickets = data.length;

  // Cliente principal
  const clientSales = data.reduce((acc, ticket) => {
    const clientId = ticket.cliente.id;
    const weight = parseFloat(ticket.peso_1) - parseFloat(ticket.peso_2);
    acc[clientId] = (acc[clientId] || 0) + weight;
    return acc;
  }, {} as Record<number, number>);

  const topClient = Object.entries(clientSales).reduce((top, [clientId, weight]) => {
    return weight > top.totalWeight ? { id: parseInt(clientId), totalWeight: weight } : top;
  }, { id: 0, totalWeight: 0 });

  const topClientName = data.find(ticket => ticket.cliente.id === topClient.id)?.cliente.name || 'N/A';

  // Producto más vendido
  const productSales = data.reduce((acc, ticket) => {
    const product = ticket.codigo_producto;
    const weight = parseFloat(ticket.peso_1) - parseFloat(ticket.peso_2);
    acc[product] = (acc[product] || 0) + weight;
    return acc;
  }, {} as Record<string, number>);

  const topProduct = Object.entries(productSales).reduce((top, [product, weight]) => {
    return weight > top.totalWeight ? { code: product, totalWeight: weight } : top;
  }, { code: '', totalWeight: 0 });

  // Distribución de productos
  const totalWeight = Object.values(productSales).reduce((sum, weight) => sum + weight, 0);
  const productDistribution = Object.entries(productSales).map(([product, weight]) => ({
    product,
    percentage: (weight / totalWeight) * 100
  }));

  // Camiones más frecuentes
  const truckVisits = data.reduce((acc, ticket) => {
    const truck = ticket.tipo_camion;
    acc[truck] = (acc[truck] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topTrucks = Object.entries(truckVisits)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type, visits]) => ({ type, visits }));

  // Día más activo
  const dailyActivity = data.reduce((acc, ticket) => {
    const date = ticket.fecha;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostActiveDay = Object.entries(dailyActivity).reduce((top, [date, count]) => {
    return count > top.count ? { date, count } : top;
  }, { date: '', count: 0 });

  // Peso total por día
  const weightByDay = Object.entries(data.reduce((acc, ticket) => {
    const date = ticket.fecha;
    const weight = parseFloat(ticket.peso_1) - parseFloat(ticket.peso_2);
    acc[date] = (acc[date] || 0) + weight;
    return acc;
  }, {} as Record<string, number>)).map(([date, weight]) => ({ date, weight }));

  // Promedio de viajes por día
  const uniqueDays = new Set(data.map(ticket => ticket.fecha)).size;
  const averageTripsPerDay = totalTickets / uniqueDays;

  return {
    totalTickets,
    topClient: { name: topClientName, totalWeight: topClient.totalWeight },
    topProduct,
    productDistribution,
    topTrucks,
    mostActiveDay,
    weightByDay,
    averageTripsPerDay,
  };
}

