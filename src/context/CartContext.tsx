import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/supabase';
import { useAuth } from './AuthContext';
import { Product } from '../types/product';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  products: Product;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Sepet toplamını hesapla
  const total = items.reduce((sum, item) => {
    if (!item.products) return sum;
    
    const basePrice = item.products.price * item.quantity;
    const discount = item.products.discount || 0;
    const finalPrice = basePrice * (1 - discount / 100);
    
    return sum + finalPrice;
  }, 0);

  // Sepeti yükle
  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setItems([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('cart_items')
          .select(`
            id,
            product_id,
            quantity,
            products (*)
          `)
          .eq('user_id', user.id);

        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // Ürün ekle
  const addItem = async (product: Product) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Önce ürünün sepette olup olmadığını kontrol et
      const existingItem = items.find(item => item.product_id === product.id);

      if (existingItem) {
        // Ürün zaten sepette varsa miktarını artır
        await updateQuantity(product.id, existingItem.quantity + 1);
      } else {
        // Yeni ürün ekle
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity: 1
          })
          .select(`
            id,
            product_id,
            quantity,
            products (*)
          `)
          .single();

        if (error) throw error;
        setItems([...items, data]);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Ürün sil
  const removeItem = async (productId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      setItems(items.filter(item => item.product_id !== productId));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Miktar güncelle
  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user || quantity < 1) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .select(`
          id,
          product_id,
          quantity,
          products (*)
        `)
        .single();

      if (error) throw error;
      setItems(items.map(item => 
        item.product_id === productId ? data : item
      ));
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sepeti temizle
  const clearCart = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};