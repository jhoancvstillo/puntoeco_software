import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProductos, getCategorias, getMarcas, getMovimientos } from "@/api/productos";
import { Producto, Categoria, Marca } from "../types/inventory";
import { ProductManager } from './ProductManager';
import { CategoryManager } from './CategoryManager';
import { BrandManager } from './BrandManager';
import GenericTable from "@/components/GenericTable";
import { useTableStore } from "@/pages/tableStore";

export function InventoryManager() {
  const [productos, setProductos] = useState<Producto[]>([
    {
      id: 0,
      nombre: "",
      categoria: { id: 0, nombre: "", descripcion: null },
      marca: { id: 0, nombre: "", descripcion: null },
      precio_por_unidad: "",
      stocks: [
        {
          id: 0,
          ubicacion: null,
          cantidad: 0,
          stock_minimo: 0,
        },
      ],
    },
  ]);
  
  const [categorias, setCategorias] = useState<Categoria[]>([
    { id: 0, nombre: "", descripcion: "" },
  ]);
  
  const [marcas, setMarcas] = useState<Marca[]>([
    { id: 0, nombre: "", descripcion: "" },
  ]);

  const [movimientos, setMovimientos] = useState<any[]>([]);
  
  const refresh = useTableStore((state) => state.refreshTable2);
  console.log("refresh desde InventoryManager", refresh);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosData, categoriasData, marcasData, movimientosData] = await Promise.all([
          getProductos(),
          getCategorias(),
          getMarcas(),
          getMovimientos()
        ]);
        setProductos(productosData);
        setCategorias(categoriasData);
        setMarcas(marcasData);
        setMovimientos(movimientosData);

      } catch (error) {
        console.error("Error al obtener datos", error);
      }
    };
    fetchData();
  }, [refresh]);

      // llamamos al historial de movimientos

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const data = await getMovimientos();
        setMovimientos(data);
      } catch (error) {
        console.error("Error fetching movimientos:", error);
      }
    }
    fetchMovimientos();
  }
  , [refresh ]);


  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="tabla" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tabla">Tabla General</TabsTrigger>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
          <TabsTrigger value="marcas">Marcas</TabsTrigger>
        </TabsList>
        <TabsContent value="productos">
          <ProductManager 
            productos={productos} 
            categorias={categorias} 
            marcas={marcas} 
            setProductos={setProductos}
          />
        </TabsContent>
        <TabsContent value="categorias">
          <CategoryManager categorias={categorias} setCategorias={setCategorias} />
        </TabsContent>
        <TabsContent value="marcas">
          <BrandManager marcas={marcas} setMarcas={setMarcas} />
        </TabsContent>
        <TabsContent value="tabla">
          <div className="space-y-4">
      
          <GenericTable  
            initialRecords={
              movimientos.map((movimiento) => ({
                id: movimiento.id,
                fecha: movimiento.created_at.split("T")[0] ,
                user: movimiento.user,
                tipo: movimiento.movement_type === "add" ? "Ingreso" : "Retiro",
                cantidad: movimiento.quantity,
                producto: movimiento.producto.nombre,
                marca: movimiento.producto.marca.nombre,
                observacion: movimiento.observation,
              }))
            }
            columns={[
              { key: "id", header: "ID" },
              { key: "fecha", header: "Fecha" },
              { key: "user", header: "Usuario" },
              { key: "tipo", header: "Tipo" },
              { key: "cantidad", header: "Cantidad" },
              { key: "producto", header: "Producto" },
              { key: "marca", header: "Marca" },
              { key: "observacion", header: "Observación" },
            ]}
            title="Historial de Movimientos"
            description="Descripción de la tabla general"
            onDelete={() => {}}
            />

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

