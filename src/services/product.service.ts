import { supabase } from '../lib/supabase/supabase';
import { Product } from '../types/product';

export const productService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Ürünler getirilirken hata:', error);
      throw new Error(error.message);
    }
    return data || [];
  },

  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'discounted_price'>): Promise<Product> {
    console.log('Oluşturulacak ürün:', product);

    const id = crypto.randomUUID();

    const supabaseProduct = {
      id,
      ...product,
      price: Number(product.price),
      stock: Number(product.stock),
      discount: Number(product.discount || 0)
    };

    const { data, error } = await supabase
      .from('products')
      .insert([supabaseProduct])
      .select()
      .single();

    if (error) {
      console.error('Ürün oluşturulurken hata:', error);
      throw new Error(error.message);
    }

    return data;
  },

  async update(id: string, product: Partial<Product>): Promise<Product> {
    console.log('Güncellenecek ürün:', id, product);

    const supabaseProduct = {
      ...product,
      price: Number(product.price),
      stock: Number(product.stock),
      discount: Number(product.discount || 0)
    };

    const { data, error } = await supabase
      .from('products')
      .update(supabaseProduct)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Ürün güncellenirken hata:', error);
      throw new Error(error.message);
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Ürün silinirken hata:', error);
      throw new Error(error.message);
    }
  }
}; 