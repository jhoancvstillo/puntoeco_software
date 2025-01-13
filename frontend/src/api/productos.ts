import axios from 'axios';
import { Producto } from '@/pages/Inventory/types/inventory';
// import { ProductManagerFormProps } from '@/pages/Inventory/components/ProductManager';
import { API_URL } from '.';
// import { ProductManagerFormProps } from '@/pages/Inventory/components/ProductManager';

import { ProductManagerFormProps } from '@/pages/Inventory/components/types';
// Crear una instancia de Axios con configuración base
const api = axios.create({
  baseURL: API_URL,
});

// Función para obtener encabezados reutilizables
const getHeaders = () => ({
  'Authorization': `Token ${localStorage.getItem('token')}`,
  'Accept': '*/*',
  'Content-Type': 'application/json',
});

// GETs
export const getProductos = async () => {
  try {
    const response = await api.get('bodega/productos/', { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getCategorias = async () => {
  try {
    const response = await api.get('bodega/categorias/', { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getMarcas = async () => {
  try {
    const response = await api.get('bodega/marcas/', { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

export const getModelos = async () => {
  try {
    const response = await api.get('bodega/modelos/', { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
};

export const getStocks = async () => {
  try {
    const response = await api.get('bodega/stocks/', { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
};

// CREATE
export const createProducto = async (data: ProductManagerFormProps) => {
  try {
    const response = await api.post('bodega/productos/', data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const createStock = async (data: any) => {
  try {
    const response = await api.post('bodega/stocks/', data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error creating stock:', error);
    throw error;
  }
};

export const createCategoria = async (data: any) => {
  try {
    const response = await api.post('bodega/categorias/', data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const createMarca = async (data: any) => {
  try {
    const response = await api.post('bodega/marcas/', data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error creating brand:', error);
    throw error;
  }
};

export const createModelo = async (data: any) => {
  try {
    const response = await api.post('bodega/modelos/', data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error creating model:', error);
    throw error;
  }
};

// UPDATE
export const updateProducto = async (
  id: number,
  productoData: Partial<Producto>
): Promise<Producto> => {
  try {
    const response = await api.patch(`bodega/productos/${id}/`, productoData, {
      headers: getHeaders(),
    });
    console.log(productoData);
    return response.data;
  } catch (error) {
    console.error('Error in updateProducto:', error);
    throw error;
  }
};

export const updateStock = async (id: number, data: any) => {
  try {
    const response = await api.patch(`bodega/stocks/${id}/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};

export const updateCategoria = async (id: number, data: any) => {
  try {
    const response = await api.put(`bodega/categorias/${id}/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const updateMarca = async (id: number, data: any) => {
  try {
    const response = await api.put(`bodega/marcas/${id}/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error updating brand:', error);
    throw error;
  }
};

export const updateModelo = async (id: number, data: any) => {
  try {
    const response = await api.put(`bodega/modelos/${id}/`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error updating model:', error);
    throw error;
  }
};

// DELETE
export const deleteProducto = async (id: number) => {
  try {
    const response = await api.delete(`bodega/productos/${id}/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const deleteStock = async (id: number) => {
  try {
    const response = await api.delete(`bodega/stocks/${id}/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error deleting stock:', error);
    throw error;
  }
};

export const deleteCategoria = async (id: number) => {
  try {
    const response = await api.delete(`bodega/categorias/${id}/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const deleteMarca = async (id: number) => {
  try {
    const response = await api.delete(`bodega/marcas/${id}/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error deleting brand:', error);
    throw error;
  }
};

export const deleteModelo = async (id: number) => {
  try {
    const response = await api.delete(`bodega/modelos/${id}/`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error deleting model:', error);
    throw error;
  }
};

// Actualiza entidades basadas en campos
export const updateEntity = async (id: number, data: any) => {
  try {
    const stockFields = ['cantidad', 'ubicacion', 'stock_minimo'];
    const isStockUpdate = Object.keys(data).some((key) => stockFields.includes(key));

    if (isStockUpdate) {
      const response = await api.patch(`bodega/stock/${id}/`, data, { headers: getHeaders() });
      return response.data;
    } else {
      const response = await api.patch(`bodega/productos/${id}/`, data, { headers: getHeaders() });
      return response.data;
    }
  } catch (error) {
    console.error('Error updating entity:', error);
    throw error;
  }
};


// Movimiento de stock

export const moveStock = async (data: any) => {
  try {
    const response = await api.post('bodega/movimientos/', data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error moving stock:', error);
    throw error;
  }
};

export const getMovimientos = async () => {
  try {
    const response = await api.get('bodega/movimientos/', { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching movements:', error);
    throw error;
  }
};