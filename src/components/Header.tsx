import React, { useState, useEffect } from 'react';
import { ShoppingCart, Store, Settings, Menu, Heart, User } from 'lucide-react';
import { Navigation } from './Navigation';
import { UserMenu } from './UserMenu';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Product } from '../types/product';
import { useNavigate } from 'react-router-dom';
import { LoginModal } from './LoginModal';
import { FavoritesModal } from './FavoritesModal';
import { useFavorites } from '../context/FavoriteContext';

interface HeaderProps {
  cartItemCount: number;
  isAdminView: boolean;
  showAllProducts: boolean;
  onToggleView: () => void;
  onShowAllProducts: () => void;
  onCategorySelect: (category: string, subcategory: string) => void;
  onShowHome: () => void;
  onCartClick: () => void;
  onProductSelect: (product: Product) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemCount,
  isAdminView,
  showAllProducts,
  onToggleView,
  onShowAllProducts,
  onCategorySelect,
  onShowHome,
  onCartClick,
  onProductSelect
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const { user } = useAuth();
  const { settings, loading } = useSettings();
  const { favorites } = useFavorites();
  const isHomePage = !isAdminView && !showAllProducts;
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUserIconClick = () => {
    if (user) {
      // Kullanıcı giriş yapmışsa hesabım sayfasına yönlendir
      navigate('/account');
    } else {
      // Kullanıcı giriş yapmamışsa login modalını aç
      setIsLoginModalOpen(true);
    }
  };

  if (loading) {
    return <div className="h-16 bg-gray-100 animate-pulse" />;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Top Navigation Bar */}
        <div className="bg-[#4A3F35]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-end items-center h-8 text-xs">
              <nav className="flex gap-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Sipariş Takibi</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Kampanyalar</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Servisler</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors font-medium">TR</a>
              </nav>
            </div>
          </div>
        </div>

        {/* Black Line */}
        <div className="h-[2px] bg-black"></div>

        {/* Main Header */}
        <div 
          className="bg-[#4A3F35] transition-all duration-300"
          style={{ 
            minHeight: `${64}px`
          }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16 relative">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                {!isAdminView && (
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <Menu size={24} />
                  </button>
                )}
              </div>

              {/* Center/Logo Section */}
              <button
                onClick={onShowHome}
                className={`flex items-center justify-center ${
                  isHomePage ? 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' : ''
                }`}
              >
                {settings.logo ? (
                  <div className="flex items-center">
                    <img 
                      src={settings.logo} 
                      alt="Logo"
                      style={{ 
                        height: isHomePage ? '80px' : '40px',
                        width: 'auto',
                        objectFit: 'contain'
                      }}
                      className="transition-all duration-300"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = '/placeholder-logo.png';
                      }}
                    />
                  </div>
                ) : (
                  <Store className={`text-white ${isHomePage ? 'h-20 w-20' : 'h-8 w-8'}`} />
                )}
              </button>

              {/* Right Section */}
              <div className="flex items-center gap-6">
                <button
                  onClick={handleUserIconClick}
                  className="text-white hover:text-gray-200 transition-colors relative"
                >
                  <User size={24} />
                  {user && (
                    <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </button>

                <button
                  onClick={() => setIsFavoritesModalOpen(true)}
                  className="text-white hover:text-gray-200 transition-colors relative"
                >
                  <Heart size={24} />
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={onCartClick}
                  className="text-white hover:text-gray-200 transition-colors relative"
                >
                  <ShoppingCart size={24} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                {user?.isAdmin && (
                  <button
                    onClick={onToggleView}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <Settings size={24} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {!isAdminView && isMenuOpen && (
            <Navigation
              isMenuOpen={isMenuOpen}
              onCloseMenu={() => setIsMenuOpen(false)}
              onCategorySelect={onCategorySelect}
              isScrolled={isScrolled}
              onCartClick={onCartClick}
              onAuthClick={handleUserIconClick}
              cartItemCount={cartItemCount}
              onProductSelect={onProductSelect}
              onShowAllProducts={onShowAllProducts}
            />
          )}
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
      />
    </>
  );
};