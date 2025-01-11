'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts'
import { AlertCircle, DollarSign, MapPin } from 'lucide-react'
import { getProductos } from '@/api/productos'
import { Producto } from '../types/inventory'

// funcion para formatear en formato de miles 
// 1234567,50 -> 1.234.567,50

function formatNumber(number: number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export default function DashboardInventario() {
  const [productosBajoStock, setProductosBajoStock] = useState(0)
  const [valorTotal, setValorTotal] = useState(0)
  const [ubicacionesUnicas, setUbicacionesUnicas] = useState<string[]>([])
  const [datosCategorias, setDatosCategorias] = useState<Array<{ nombre: string; cantidad: number }>>([])
  const [datosUbicaciones, setDatosUbicaciones] = useState<Array<{ nombre: string; cantidad: number }>>([])

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos()
        procesarDatos(data)
      } catch (error) {
        console.error("Error al obtener productos", error)
      }
    }
    fetchProductos()
  }, [])

  const procesarDatos = (data: Producto[]) => {
    // Calcular productos con bajo stock
    const bajoStock = data.filter(producto => 
      producto.stocks.some(stock => stock.cantidad <= stock.stock_minimo)
    ).length
    setProductosBajoStock(bajoStock)

    // Calcular valor total del inventario
    const total = data.reduce((sum, producto) => 
      sum + parseFloat(producto.precio_por_unidad) * producto.stocks.reduce((stockSum, stock) => stockSum + stock.cantidad, 0), 0
    )
    setValorTotal(total)

    // Obtener ubicaciones únicas
    const ubicaciones = Array.from(new Set(data.flatMap(producto => 
      producto.stocks.map(stock => stock.ubicacion).filter((ubicacion): ubicacion is string => ubicacion !== null)
    )))
    setUbicacionesUnicas(ubicaciones)

    // Preparar datos de categorías
    const conteoCategoria = data.reduce((acc, producto) => {
      const categoria = producto.categoria.nombre
      acc[categoria] = (acc[categoria] || 0) + producto.stocks.reduce((sum, stock) => sum + stock.cantidad, 0)
      return acc
    }, {} as Record<string, number>)
    setDatosCategorias(Object.entries(conteoCategoria).map(([nombre, cantidad]) => ({ nombre, cantidad })))

    // Preparar datos de ubicaciones
    const conteoUbicacion = data.reduce((acc, producto) => {
      producto.stocks.forEach(stock => {
        if (stock.ubicacion !== null) {
          acc[stock.ubicacion] = (acc[stock.ubicacion] || 0) + stock.cantidad
        }
      })
      return acc
    }, {} as Record<string, number>)
    setDatosUbicaciones(Object.entries(conteoUbicacion).map(([nombre, cantidad]) => ({ nombre, cantidad })))
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Panel de Control de Inventario</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos con Bajo Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productosBajoStock}</div>
            <p className="text-xs text-muted-foreground">Productos necesitan reabastecimiento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total del Inventario</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formatNumber(parseFloat(valorTotal.toFixed(2)))}</div>
            <p className="text-xs text-muted-foreground">Valor total de todos los productos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ubicaciones de Almacenamiento</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ubicacionesUnicas.length}</div>
            <p className="text-xs text-muted-foreground">{ubicacionesUnicas.join(', ')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Productos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosCategorias}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" angle={-45} textAnchor="end" interval={0} height={70} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Stock por Ubicación</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosUbicaciones}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" angle={-45} textAnchor="end" interval={0} height={70} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cantidad" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

