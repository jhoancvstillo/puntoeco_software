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
  modelo: {
    id: number;
    nombre: string;
    descripcion: string;
    marca: {
      id: number;
      nombre: string;
      descripcion: string | null;
    };
  } | null;
  precio_por_unidad: string; // Viene como string en tu JSON
  stocks: {
    id: number;
    ubicacion: string | null; // Ubicación puede ser null
    cantidad: number;         // Cantidad de productos en stock
    stock_minimo: number;     // Stock mínimo requerido
  }[]; // Lista de stocks relacionados con el producto
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

export interface Modelo {
  id: number;
  nombre: string;
  descripcion: string;
  marca: {
    id: number;
    nombre: string;
    descripcion: string;
  }
}

export interface ModeloFormProps{
  modelos: Modelo[];
  marcas: Marca[];
  setModelos: React.Dispatch<React.SetStateAction<Modelo[]>>;
}

export interface CategoryFormProps{
  categorias: Categoria[];
  setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>;
}

export interface ProductFormProps{
  productos: Producto[];
  categorias: Categoria[];
  marcas: Marca[];
  modelos: Modelo[];
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
}