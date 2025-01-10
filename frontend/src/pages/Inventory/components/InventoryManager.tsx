import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProductos, getCategorias, getMarcas } from "@/api/productos";
import { Producto, Categoria, Marca } from "../types/inventory";
import { ProductManager } from './ProductManager';
import { CategoryManager } from './CategoryManager';
import { BrandManager } from './BrandManager';
import InventoryFilters from "./InventoryFilters";
import InventoryTable from "./InventoryTable";

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
  

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

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
  console.log(productos);
  const filteredProductos = productos.filter((p) => {
    // Convierte el término de búsqueda a minúsculas para una comparación insensible a mayúsculas
    const lowerSearchTerm = searchTerm.toLowerCase();

    // Verifica si el nombre del producto incluye el término de búsqueda
    const matchesName = p.nombre.toLowerCase().includes(lowerSearchTerm);

    // Verifica si el nombre de la categoría incluye el término de búsqueda
    const matchesCatName = p.categoria.nombre.toLowerCase().includes(lowerSearchTerm);

    // Verifica si se ha seleccionado una categoría específica y coincide con la del producto
    const matchesSelectedCat = !selectedCategory || p.categoria.id === selectedCategory;

    // El producto se incluye si coincide con el término de búsqueda en nombre o categoría
    // Y si coincide con la categoría seleccionada (o no hay categoría seleccionada)
    return (matchesName || matchesCatName) && matchesSelectedCat;
});
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
            <InventoryFilters
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categorias}
            />
            <InventoryTable productos={filteredProductos} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

