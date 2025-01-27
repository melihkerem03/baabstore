import React, { useState, useEffect } from 'react';
import { X, Search, ShoppingCart, User } from 'lucide-react';
import { useCategories } from '../context/CategoryContext';
import { MenuSearch } from './MenuSearch';

interface NavigationProps {
  isMenuOpen: boolean;
  onCloseMenu: () => void;
  onCategorySelect: (category: string, subcategory: string) => void;
  isScrolled: boolean;
  onCartClick: () => void;
  onAuthClick: () => void;
  onSearchClick: () => void;
  cartItemCount: number;
  onProductSelect: (product: any) => void;
  onShowAllProducts: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  isMenuOpen,
  onCloseMenu,
  onCategorySelect,
  isScrolled,
  onCartClick,
  onAuthClick,
  cartItemCount,
  onProductSelect,
  onShowAllProducts
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [menuState, setMenuState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');
  const { categories, categoryTitles } = useCategories();

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  useEffect(() => {
    if (isMenuOpen && menuState === 'closed') {
      setMenuState('opening');
      setTimeout(() => setMenuState('open'), 100);
    } else if (!isMenuOpen && (menuState === 'open' || menuState === 'opening')) {
      setMenuState('closing');
      setTimeout(() => setMenuState('closed'), 1000);
    }
  }, [isMenuOpen, menuState]);

  if (menuState === 'closed') return null;

  const isAnimatingIn = menuState === 'opening' || menuState === 'open';

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-500 ${
          isAnimatingIn ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={onCloseMenu}
      />
      
      {/* Menu Panel */}
      <div 
        className={`fixed top-0 left-0 right-0 bg-[#4A3F35] transform transition-transform duration-500 ease-in-out ${
          isAnimatingIn ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#5C4D41]">
          <button
            onClick={handleSearchClick}
            className="p-2 text-white hover:text-gray-300 transition-colors"
          >
            <Search size={24} />
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={onAuthClick}
              className="p-2 text-white hover:text-gray-300 transition-colors"
            >
              <User size={24} />
            </button>
            <button
              onClick={onCartClick}
              className="p-2 text-white hover:text-gray-300 transition-colors relative"
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={onCloseMenu}
              className="p-2 text-white hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        {isSearchOpen ? (
          <MenuSearch 
            onProductSelect={onProductSelect}
            onClose={onCloseMenu}
          />
        ) : (
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-73px)]">
            <div className="max-w-lg mx-auto space-y-8">
              {/* Tüm Ürünler */}
              <div 
                style={{
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: isAnimatingIn ? '200ms' : '800ms',
                  opacity: isAnimatingIn ? 1 : 0,
                  transform: isAnimatingIn ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                <button
                  onClick={() => {
                    onShowAllProducts();
                    onCloseMenu();
                  }}
                  className="w-full text-left px-6 py-4 text-xl font-medium text-white hover:bg-[#5C4D41] transition-colors rounded-lg"
                >
                  Tüm Ürünler
                </button>
              </div>

              {/* Kategoriler */}
              {categories.map((category, categoryIndex) => {
                const titleInfo = categoryTitles.find(t => t.categoryName === category.name);
                const delay = isAnimatingIn 
                  ? (categoryIndex + 2) * 150 // Açılırken artan gecikme
                  : (categories.length - categoryIndex) * 150; // Kapanırken azalan gecikme

                return (
                  <div 
                    key={category.name}
                    style={{
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDelay: `${delay}ms`,
                      opacity: isAnimatingIn ? 1 : 0,
                      transform: isAnimatingIn ? 'translateY(0)' : 'translateY(20px)'
                    }}
                  >
                    <h3 className="text-lg font-medium text-gray-300 mb-2 px-6">
                      {titleInfo?.title || category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                    </h3>
                    {titleInfo?.subtitle && (
                      <p className="text-sm text-gray-400 mb-2 px-6">
                        {titleInfo.subtitle}
                      </p>
                    )}
                    <div className="space-y-1">
                      {category.subcategories.map((subcategory, subIndex) => {
                        const subDelay = delay + ((subIndex + 1) * 50);
                        
                        return (
                          <button
                            key={subcategory}
                            onClick={() => {
                              onCategorySelect(category.name, subcategory);
                              onCloseMenu();
                            }}
                            style={{
                              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                              transitionDelay: `${subDelay}ms`,
                              opacity: isAnimatingIn ? 1 : 0,
                              transform: isAnimatingIn ? 'translateY(0)' : 'translateY(20px)'
                            }}
                            className="w-full text-left px-6 py-3 text-white hover:bg-[#5C4D41] transition-colors rounded-lg"
                          >
                            {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};