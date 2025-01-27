import { Product } from '../types/product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Gaming Laptop Pro',
    price: 24999.99,
    description: 'Yüksek performanslı oyun bilgisayarı',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500',
    stock: 10,
    category: 'bilgisayar',
    subcategory: 'oyun bilgisayarı'
  },
  {
    id: '2',
    name: 'İş Laptopu Ultra',
    price: 19999.99,
    description: 'Profesyonel iş bilgisayarı',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
    stock: 15,
    category: 'bilgisayar',
    subcategory: 'iş bilgisayarı'
  },
  {
    id: '3',
    name: 'Apple Watch Series 8',
    price: 9999.99,
    description: 'En son teknoloji akıllı saat',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500',
    stock: 20,
    category: 'saat',
    subcategory: 'akıllı saat'
  },
  {
    id: '4',
    name: 'Klasik Chronograph',
    price: 4999.99,
    description: 'Lüks klasik saat',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
    stock: 8,
    category: 'saat',
    subcategory: 'klasik saat'
  },
  {
    id: '5',
    name: 'iPhone 15 Pro',
    price: 49999.99,
    description: 'Apple\'ın en yeni amiral gemisi',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500',
    stock: 25,
    category: 'telefon',
    subcategory: 'ios'
  },
  {
    id: '6',
    name: 'Samsung Galaxy S24',
    price: 39999.99,
    description: 'Android\'in en güçlü telefonu',
    image: 'https://images.unsplash.com/photo-1533228100845-08145b01de14?w=500',
    stock: 15,
    category: 'telefon',
    subcategory: 'android'
  }
];