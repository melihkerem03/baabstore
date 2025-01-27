import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, CategoryTitle } from '../types/product';
import { categoryService } from '../lib/supabase/services/category.service';

interface CategoryContextType {
  categories: Category[];
  categoryTitles: CategoryTitle[];
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryName: string) => Promise<void>;
  reorderCategories: (newOrder: Category[]) => Promise<void>;
  updateCategoryTitles: (titles: CategoryTitle[]) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTitles, setCategoryTitles] = useState<CategoryTitle[]>([]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    }
  };

  const fetchCategoryTitles = async () => {
    try {
      const data = await categoryService.getCategoryTitles();
      setCategoryTitles(data);
    } catch (error) {
      console.error('Kategori başlıkları yüklenirken hata:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCategoryTitles();
  }, []);

  const addCategory = async (category: Category) => {
    try {
      console.log('Adding category:', category);
      const newCategory = {
        name: category.name,
        subcategories: Array.isArray(category.subcategories) ? category.subcategories : [],
        order_number: categories.length
      };
      
      console.log('Prepared category:', newCategory);
      await categoryService.createCategory(newCategory);
      console.log('Category created, fetching categories...');
      await fetchCategories();
      console.log('Categories fetched');
    } catch (error) {
      console.error('Kategori eklenirken hata:', error);
      throw error;
    }
  };

  const updateCategory = async (category: Category) => {
    try {
      await categoryService.updateCategory(category.name, {
        name: category.name,
        subcategories: category.subcategories,
        order_number: category.order_number
      });
      await fetchCategories();
    } catch (error) {
      console.error('Kategori güncellenirken hata:', error);
      throw error;
    }
  };

  const deleteCategory = async (categoryName: string) => {
    try {
      await categoryService.deleteCategory(categoryName);
      await fetchCategories();
    } catch (error) {
      console.error('Kategori silinirken hata:', error);
      throw error;
    }
  };

  const reorderCategories = async (newOrder: Category[]) => {
    try {
      await categoryService.reorderCategories(newOrder);
      setCategories(newOrder);
    } catch (error) {
      console.error('Kategoriler sıralanırken hata:', error);
      throw error;
    }
  };

  const updateCategoryTitles = async (titles: CategoryTitle[]) => {
    try {
      await categoryService.updateCategoryTitles(titles);
      setCategoryTitles(titles);
    } catch (error) {
      console.error('Kategori başlıkları güncellenirken hata:', error);
      throw error;
    }
  };

  return (
    <CategoryContext.Provider value={{
      categories,
      categoryTitles,
      addCategory,
      updateCategory,
      deleteCategory,
      reorderCategories,
      updateCategoryTitles
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};