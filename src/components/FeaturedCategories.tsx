import React from 'react';
import { FeaturedCategory } from '../types/featuredCategory';
import { ChevronRight } from 'lucide-react';

interface FeaturedCategoriesProps {
  categories: FeaturedCategory[];
  onNavigate: (category: string, subcategory: string) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  categories,
  onNavigate,
}) => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-12">Öne Çıkan Kategoriler</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.sort((a, b) => a.order - b.order).map((category) => (
            <div
              key={category.id}
              className="group relative aspect-[4/3] overflow-hidden cursor-pointer"
              onClick={() => onNavigate(category.category, category.subcategory)}
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <h3 className="text-2xl font-bold text-center mb-4 uppercase tracking-wider">
                  {category.title}
                </h3>
                <div className="flex items-center gap-2 text-sm opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  <span>KEŞFET</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => onNavigate('', '')}
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-black text-black hover:bg-black hover:text-white transition-colors duration-300"
          >
            DAHA FAZLA GÖSTER
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}; 