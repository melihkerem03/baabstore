import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types/product';

interface CategoryShowcaseProps {
  category: string;
  products: Product[];
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ category, products }) => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-white shadow-lg">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{category}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                />
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-medium text-gray-900">{product.name}</h4>
                <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {product.price.toLocaleString('tr-TR', {
                    style: 'currency',
                    currency: 'TRY'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
            Tüm {category} Ürünlerini Gör
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};