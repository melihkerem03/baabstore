import React, { useEffect, useRef } from 'react';
import { useHomeSections } from '../context/HomeSectionContext';
import { AnnouncementBanner } from './AnnouncementBanner';
import { SearchBar } from './SearchBar';
import { Product } from '../types/product';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from './ProductCard';
import { FeaturedCategories } from './FeaturedCategories';
import { useFeaturedCategories } from '../context/FeaturedCategoryContext';

interface HomePageProps {
  onNavigate?: (category: string, subcategory: string) => void;
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onNavigate, 
  onProductSelect,
  onAddToCart
}) => {
  const { sections } = useHomeSections();
  const { products } = useProducts();
  const discountedProductsRef = useRef<HTMLDivElement>(null);
  const { categories: featuredCategories, loading: featuredLoading } = useFeaturedCategories();

  const handleNavigate = (category: string, subcategory: string) => {
    try {
      console.group('Navigation Details');
      console.log('Attempting to navigate with:', { category, subcategory });
      
      if (onNavigate) {
        console.log('Calling onNavigate function...');
        onNavigate(category, subcategory);
        console.log('Navigation successful');
      } else {
        console.error('Navigation failed: onNavigate prop is not provided');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      console.groupEnd();
    }
  };

  // İndirimli ürünleri filtrele
  const discountedProducts = products.filter(product => (product.discount ?? 0) > 0);

  useEffect(() => {
    // URL'de #discounted-products hash'i varsa o bölüme scroll yap
    if (window.location.hash === '#discounted-products' && discountedProductsRef.current) {
      const yOffset = -140; // Navbar yüksekliğini hesaba kat
      const element = discountedProductsRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Hero Sections */}
      <div className="space-y-4 pt-20">
        {sections.map((section) => {
          console.log('Rendering section:', section);
          return (
            <section 
              key={section.id} 
              onClick={() => {
                console.log('Section clicked:', {
                  category: section.category,
                  targetSubcategory: section.targetSubcategory
                });
                handleNavigate(section.category, section.targetSubcategory);
              }}
              className="relative h-screen w-full flex items-center justify-center cursor-pointer group"
            >
              <div className="absolute inset-0">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              
              <div className="relative text-center text-white space-y-6 max-w-4xl mx-auto px-4">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
                  {section.title}
                </h2>
                <p className="text-xl md:text-2xl font-light">
                  {section.subtitle}
                </p>
              </div>
            </section>
          );
        })}
      </div>

      {/* Discounted Products Section */}
      {discountedProducts.length > 0 && (
        <div 
          ref={discountedProductsRef}
          id="discounted-products" 
          className="bg-white py-16"
        >
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8">İndirimli Ürünler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {discountedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onViewDetails={onProductSelect}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Featured Categories */}
      {!featuredLoading && featuredCategories.length > 0 && (
        <FeaturedCategories 
          categories={featuredCategories}
          onNavigate={onNavigate || (() => {})}
        />
      )}
      
      {/* Fixed Elements */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <AnnouncementBanner />
        <div className="absolute -top-16 w-full">
          <SearchBar onProductSelect={onProductSelect} />
        </div>
      </div>
    </div>
  );
};