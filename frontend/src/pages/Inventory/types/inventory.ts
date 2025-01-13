export interface Producto {
  id: number;
  nombre: string;
  categoria: {
    id: number;
    nombre: string;
    descripcion: string | null;
  };
  marca: {
    id: number;
    nombre: string;
    descripcion: string | null;
  };
  precio_por_unidad: string; // Viene como string en tu JSON
  stocks: {
    id: number;
    ubicacion: string | null; // Ubicación puede ser null
    cantidad: number;         // Cantidad de productos en stock
    stock_minimo: number;     // Stock mínimo requerido
  }[]; // Lista de stocks relacionados con el producto
  tipo?: string; // Add this line
  fecha?: string; // Add this line
  user?: string; // Add this line
  cantidad?: number; // Add this line
  productoId?: number; // Add this line
  stockId?: number; // Add this line
  stock?: number; // Add this line
  stock_minimo?: number; // Add this line
  ubicacion?: string; // Add this line
  observacion?: string; // Add this line
  producto?: string; // Add this line
}



export interface Categoria {
  id: number;
  nombre: string;
  descripcion:  string;
}

export interface Marca {
  id: number;
  nombre: string;
  descripcion: string;
}



export interface CategoryFormProps{
  categorias: Categoria[];
  setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>;
}

export interface ProductFormProps{
  productos: Producto[];
  categorias: Categoria[];
  marcas: Marca[];
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
}