import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/product';
import { productService } from '../services/product.service';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError('Ürünler yüklenirken bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const newProduct = await productService.create(product);
      setProducts(prev => [...prev, newProduct]);
    } catch (err) {
      console.error('Ürün eklenirken hata:', err);
      throw err;
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const updatedProduct = await productService.update(product.id, product);
      setProducts(prev => prev.map(p => p.id === product.id ? updatedProduct : p));
    } catch (err) {
      console.error('Ürün güncellenirken hata:', err);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Ürün silinirken hata:', err);
      throw err;
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      error,
      addProduct,
      updateProduct,
      deleteProduct,
      refreshProducts: fetchProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};