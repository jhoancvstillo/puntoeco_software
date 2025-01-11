
import { Producto, Categoria, Marca } from "../types/inventory";


export interface ProductManagerProps {
  productos: Producto[];
  categorias: Categoria[];
  marcas: Marca[];
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
}

export interface ProductManagerFormProps {
  nombre: string;
  categoria: number;
  marca: number;
  precio_por_unidad: string;
  stocks: {
    id: number;
    ubicacion: string;
    cantidad: number;
    stock_minimo: number;
  }[];
}


export interface ProductManagerProps {
  productos: Producto[];
  categorias: Categoria[];
  marcas: Marca[];
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
}
