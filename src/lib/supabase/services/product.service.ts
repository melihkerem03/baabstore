import { supabase } from '../config';
import { Product } from '../../../types/product';

export const productService = {
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as Product[];
  },

  async createProduct(product: Omit<Product, 'id'>) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },

  async updateProduct(id: string, product: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async reorderProducts(products: Product[]) {
    const updates = products.map((product, index) => ({
      id: product.id,
      order: index,
    }));

    const { error } = await supabase
      .from('products')
      .upsert(updates);

    if (error) throw error;
  },
};