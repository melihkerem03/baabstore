export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  discountedPrice?: number;
  category: string;
  subcategory: string;
  stock: number;
  images: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  name: string;
  subcategories: string[];
  order_number: number;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryTitle {
  categoryName: string;
  title: string;
  subtitle: string;
  created_at?: string;
  updated_at?: string;
}

export const categories: Category[] = [
  {
    name: 'bilgisayar',
    subcategories: ['oyun bilgisayarı', 'iş bilgisayarı']
  },
  {
    name: 'saat',
    subcategories: ['akıllı saat', 'klasik saat']
  },
  {
    name: 'telefon',
    subcategories: ['ios', 'android']
  }
];