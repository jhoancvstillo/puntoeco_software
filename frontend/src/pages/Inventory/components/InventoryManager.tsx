import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProductos, getCategorias, getMarcas } from "@/api/productos";
import { Producto, Categoria, Marca } from "../types/inventory";
import { ProductManager } from './ProductManager';
import { CategoryManager } from './CategoryManager';
import { BrandManager } from './BrandManager';
import GenericTable from "@/components/GenericTable";

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
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosData, categoriasData, marcasData] = await Promise.all([
          getProductos(),
          getCategorias(),
          getMarcas(),
        ]);
        setProductos(productosData);
        setCategorias(categoriasData);
        setMarcas(marcasData);
      } catch (error) {
        console.error("Error al obtener datos", error);
      }
    };
    fetchData();
  }, []);


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
              productos.map((p) => ({
                ...p,
                marca: p.marca.nombre,
                categoria: p.categoria.nombre,
                stocks: p.stocks.reduce((acc, stock) => acc + stock.cantidad, 0),
                ubicacion: p.stocks.map((stock) => stock.ubicacion).join(", "),
              }))
            }
            columns={[
              { key: "nombre", header: "Nombre" },
              { key: "categoria", header: "Categoría" },
              { key: "marca", header: "Marca" },
              { key: "precio_por_unidad", header: "Precio por Unidad" },
              { key: "stocks", header: "Stocks" },
              { key: "ubicacion", header: "Ubicación" },
              
            ]}
            title="Tabla General"
            description="Descripción de la tabla general"
            onDelete={() => {}
            }
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

