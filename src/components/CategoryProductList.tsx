import React, { useState, useRef, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from './ProductCard';
import { categories, Product } from '../types/product';
import { FilterDrawer } from './FilterDrawer';
import { SortModal } from './SortModal';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';

interface CategoryProductListProps {
  category: string;
  subcategory: string;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onNavigate: (category: string, subcategory: string) => void;
}

interface FilterState {
  minPrice: number | null;
  maxPrice: number | null;
  onlyDiscounted: boolean;
  onlyInStock: boolean;
}

export const CategoryProductList: React.FC<CategoryProductListProps> = ({
  category,
  subcategory,
  onAddToCart,
  onViewDetails,
  onNavigate
}) => {
  const { products } = useProducts();
  const categoryInfo = categories.find(c => c.name === category);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  
  // Filtreleme state'i
  const [filters, setFilters] = useState<FilterState>({
    minPrice: null,
    maxPrice: null,
    onlyDiscounted: false,
    onlyInStock: false
  });

  // Sıralama state'i
  const [sortType, setSortType] = useState<string>('');

  // Breadcrumb items
  const breadcrumbItems = useMemo(() => [
    {
      label: 'Ana Sayfa',
      onClick: () => onNavigate('', '')
    },
    {
      label: categoryInfo?.name ? (categoryInfo.name.charAt(0).toUpperCase() + categoryInfo.name.slice(1)) : category,
      onClick: () => onNavigate(category, '')
    },
    {
      label: subcategory.charAt(0).toUpperCase() + subcategory.slice(1)
    }
  ], [category, subcategory, categoryInfo, onNavigate]);

  // Önce kategori ve alt kategoriye göre filtrele
  const categoryProducts = useMemo(() => {
    return products.filter(
      product => product.category === category && product.subcategory === subcategory
    );
  }, [products, category, subcategory]);

  // Filtreleri uygula
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter(product => {
      // Fiyat filtresi
      if (filters.minPrice && product.price < filters.minPrice) return false;
      if (filters.maxPrice && product.price > filters.maxPrice) return false;
      
      // İndirim filtresi
      if (filters.onlyDiscounted && (!product.discount || product.discount <= 0)) return false;
      
      // Stok filtresi
      if (filters.onlyInStock && product.stock <= 0) return false;

      return true;
    });
  }, [categoryProducts, filters]);

  // Sıralamayı uygula
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    
    switch (sortType) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'discount':
        return sorted.sort((a, b) => {
          const discountA = a.discount || 0;
          const discountB = b.discount || 0;
          return discountB - discountA;
        });
      default:
        return sorted;
    }
  }, [filteredProducts, sortType]);

  const handleSort = (type: string) => {
    setSortType(type);
  };

  const handleFilter = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="pt-[150px] min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 flex justify-center">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Filtre ve Sıralama Butonları */}
        <div className="flex justify-between items-center mb-8 bg-[#4A3F35] p-4">
          <button
            ref={filterButtonRef}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-none hover:bg-[#5C4D41] transition-colors"
          >
            <SlidersHorizontal size={20} />
            FİLTRELER
            <ChevronDown 
              size={20}
              className={`transform transition-transform duration-200 ${
                isFilterOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          <button
            ref={sortButtonRef}
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-none hover:bg-[#5C4D41] transition-colors"
          >
            SIRALA
            <ChevronDown 
              size={20}
              className={`transform transition-transform duration-200 ${
                isSortOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
          </h2>
          <p className="mt-2 text-gray-600">
            {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} kategorisinde {sortedProducts.length} ürün bulundu
          </p>
        </div>

        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Bu kriterlere uygun ürün bulunmamaktadır.</p>
          </div>
        )}
      </div>

      {/* Filtre ve Sıralama Bileşenleri */}
      <FilterDrawer 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        anchorEl={filterButtonRef.current}
        onFilter={handleFilter}
        currentFilters={filters}
      />
      <SortModal 
        isOpen={isSortOpen} 
        onClose={() => setIsSortOpen(false)}
        onSort={handleSort}
        anchorEl={sortButtonRef.current}
      />
    </div>
  );
};