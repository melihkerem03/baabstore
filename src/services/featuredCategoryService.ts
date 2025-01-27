import { supabase } from '../lib/supabase';
import { FeaturedCategory } from '../types/featuredCategory';

export const featuredCategoryService = {
  async getFeaturedCategories(): Promise<FeaturedCategory[]> {
    const { data, error } = await supabase
      .from('featured_categories')
      .select('*')
      .order('order_number');

    if (error) {
      console.error('Error fetching featured categories:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      subcategory: item.subcategory,
      order: item.order_number
    }));
  },

  async addFeaturedCategory(category: Omit<FeaturedCategory, 'id'>): Promise<FeaturedCategory | null> {
    const { data, error } = await supabase
      .from('featured_categories')
      .insert([{
        title: category.title,
        image: category.image,
        category: category.category,
        subcategory: category.subcategory,
        order_number: category.order
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding featured category:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      image: data.image,
      category: data.category,
      subcategory: data.subcategory,
      order: data.order_number
    };
  },

  async updateFeaturedCategory(id: string, category: Partial<FeaturedCategory>): Promise<boolean> {
    const { error } = await supabase
      .from('featured_categories')
      .update({
        title: category.title,
        image: category.image,
        category: category.category,
        subcategory: category.subcategory,
        order_number: category.order,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating featured category:', error);
      return false;
    }

    return true;
  },

  async deleteFeaturedCategory(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('featured_categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting featured category:', error);
      return false;
    }

    return true;
  },

  async reorderFeaturedCategories(categories: FeaturedCategory[]): Promise<boolean> {
    const updates = categories.map((cat, index) => ({
      id: cat.id,
      order_number: index + 1
    }));

    const { error } = await supabase
      .from('featured_categories')
      .upsert(updates);

    if (error) {
      console.error('Error reordering featured categories:', error);
      return false;
    }

    return true;
  }
}; 