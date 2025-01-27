export interface CategoryTitle {
  categoryName: string;
  title: string;
  subtitle: string;
}

export interface CategoryContextType {
  categories: Category[];
  categoryTitles: CategoryTitle[];
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryName: string) => void;
  reorderCategories: (newOrder: Category[]) => void;
  updateCategoryTitles: (titles: CategoryTitle[]) => Promise<void>;
}