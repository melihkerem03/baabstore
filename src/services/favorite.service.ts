import { supabase } from '../lib/supabase/supabase';

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export const favoriteService = {
  // Favori ekle
  async addToFavorites(userId: string, productId: string): Promise<Favorite> {
    const { data, error } = await supabase
      .from('favorites')
      .insert([
        { user_id: userId, product_id: productId }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint hatası
        throw new Error('Bu ürün zaten favorilerinizde');
      }
      throw error;
    }

    return data;
  },

  // Favorilerden kaldır
  async removeFromFavorites(userId: string, productId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .match({ user_id: userId, product_id: productId });

    if (error) throw error;
  },

  // Kullanıcının tüm favorilerini getir
  async getUserFavorites(userId: string): Promise<Favorite[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        products:product_id (
          id,
          name,
          price,
          images
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  },

  // Ürünün favori durumunu kontrol et
  async isFavorite(userId: string, productId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .match({ user_id: userId, product_id: productId })
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116: Not Found
    return !!data;
  }
}; 