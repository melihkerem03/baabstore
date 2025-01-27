import { supabase } from '../config';
import { Category, CategoryTitle } from '../../../types/product';

export const categoryService = {
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order_number', { ascending: true });

    if (error) throw error;
    return data as Category[];
  },

  async createCategory(category: Omit<Category, 'id'>) {
    console.log('Creating category:', category);
    
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name: category.name,
        subcategories: Array.isArray(category.subcategories) ? category.subcategories : [],
        order_number: category.order_number || 0
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Created category:', data);
    return data as Category;
  },

  async updateCategory(name: string, category: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: category.name,
        subcategories: category.subcategories,
        order_number: category.order_number
      })
      .eq('name', name)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  },

  async deleteCategory(name: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('name', name);

    if (error) throw error;
  },

  async getCategoryTitles() {
    const { data, error } = await supabase
      .from('category_titles')
      .select('*')
      .order('categoryName');

    if (error) throw error;
    return data as CategoryTitle[];
  },

  async updateCategoryTitles(titles: CategoryTitle[]) {
    const { error } = await supabase
      .from('category_titles')
      .upsert(titles.map(title => ({
        categoryName: title.categoryName,
        title: title.title,
        subtitle: title.subtitle
      })));

    if (error) throw error;
  },

  async reorderCategories(categories: Category[]) {
    const updates = categories.map((category, index) => ({
      name: category.name,
      order_number: index,
      subcategories: category.subcategories
    }));

    const { error } = await supabase
      .from('categories')
      .upsert(updates, { 
        onConflict: 'name',
        ignoreDuplicates: false 
      });

    if (error) throw error;
  },
};