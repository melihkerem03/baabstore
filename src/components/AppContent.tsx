import React, { useState } from 'react';
import { Header } from './Header';
import { ProductGrid } from './ProductGrid';
import { AdminPanel } from './AdminPanel';
import { HomePage } from './HomePage';
import { CategoryProductList } from './CategoryProductList';
import { CartModal } from './CartModal';
import { ProductDetail } from './ProductDetail';
import { AuthModal } from './AuthModal';
import { AdminLogin } from './AdminLogin';
import { Footer } from './Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types/product';

export const AppContent: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { items, addItem } = useCart();
  const { user } = useAuth();

  const handleCategorySelect = (category: string, subcategory: string) => {
    console.log('AppContent - Category selected:', { category, subcategory });
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setShowAllProducts(false);
    setSelectedProduct(null);
    setIsAdminView(false);
  };

  const handleShowHome = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setShowAllProducts(false);
    setSelectedProduct(null);
    setIsAdminView(false);
  };

  const handleViewProductDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleBackFromDetails = () => {
    setSelectedProduct(null);
  };

  if (isAdminView && (!user || !user.isAdmin)) {
    return <AdminLogin onSuccess={() => setIsAdminView(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        cartItemCount={items.length} 
        isAdminView={isAdminView}
        onToggleView={() => setIsAdminView(!isAdminView)}
        onShowAllProducts={() => {
          setShowAllProducts(!showAllProducts);
          setSelectedCategory(null);
          setSelectedSubcategory(null);
          setSelectedProduct(null);
        }}
        showAllProducts={showAllProducts}
        onCategorySelect={handleCategorySelect}
        onShowHome={handleShowHome}
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
        onProductSelect={handleViewProductDetails}
      />
      <main className="flex-1">
        {isAdminView ? (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <AdminPanel />
          </div>
        ) : selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onAddToCart={addItem}
            onBack={handleBackFromDetails}
          />
        ) : selectedCategory && selectedSubcategory ? (
          <CategoryProductList
            category={selectedCategory}
            subcategory={selectedSubcategory}
            onAddToCart={addItem}
            onViewDetails={handleViewProductDetails}
            onNavigate={handleCategorySelect}
          />
        ) : showAllProducts ? (
          <div className="max-w-7xl mx-auto px-4 py-8 mt-[100px]">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">Tüm Ürünler</h2>
            </div>
            <ProductGrid 
              onAddToCart={addItem}
              onViewDetails={handleViewProductDetails}
            />
          </div>
        ) : (
          <HomePage 
            onNavigate={handleCategorySelect}
            onProductSelect={handleViewProductDetails}
            onAddToCart={addItem}
          />
        )}
      </main>
      <Footer />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};