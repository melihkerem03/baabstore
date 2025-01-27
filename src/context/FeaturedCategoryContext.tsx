import React, { createContext, useContext, useState, useEffect } from 'react';
import { FeaturedCategory } from '../types/featuredCategory';
import { featuredCategoryService } from '../services/featuredCategoryService';

interface FeaturedCategoryContextType {
  categories: FeaturedCategory[];
  loading: boolean;
  error: string | null;
  addCategory: (category: Omit<FeaturedCategory, 'id'>) => Promise<FeaturedCategory | null>;
  updateCategory: (id: string, category: Partial<FeaturedCategory>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  reorderCategories: (categories: FeaturedCategory[]) => Promise<boolean>;
  refreshCategories: () => Promise<void>;
}

const FeaturedCategoryContext = createContext<FeaturedCategoryContextType | undefined>(undefined);

export const FeaturedCategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<FeaturedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      const data = await featuredCategoryService.getFeaturedCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Öne çıkan kategoriler yüklenirken bir hata oluştu.');
      console.error('Error loading featured categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async (category: Omit<FeaturedCategory, 'id'>) => {
    const newCategory = await featuredCategoryService.addFeaturedCategory(category);
    if (newCategory) {
      setCategories(prev => [...prev, newCategory]);
    }
    return newCategory;
  };

  const updateCategory = async (id: string, category: Partial<FeaturedCategory>) => {
    const success = await featuredCategoryService.updateFeaturedCategory(id, category);
    if (success) {
      setCategories(prev => 
        prev.map(cat => 
          cat.id === id ? { ...cat, ...category } : cat
        )
      );
    }
    return success;
  };

  const deleteCategory = async (id: string) => {
    const success = await featuredCategoryService.deleteFeaturedCategory(id);
    if (success) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
    return success;
  };

  const reorderCategories = async (newCategories: FeaturedCategory[]) => {
    const success = await featuredCategoryService.reorderFeaturedCategories(newCategories);
    if (success) {
      setCategories(newCategories);
    }
    return success;
  };

  return (
    <FeaturedCategoryContext.Provider
      value={{
        categories,
        loading,
        error,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        refreshCategories: loadCategories
      }}
    >
      {children}
    </FeaturedCategoryContext.Provider>
  );
};

export const useFeaturedCategories = () => {
  const context = useContext(FeaturedCategoryContext);
  if (context === undefined) {
    throw new Error('useFeaturedCategories must be used within a FeaturedCategoryProvider');
  }
  return context;
}; 