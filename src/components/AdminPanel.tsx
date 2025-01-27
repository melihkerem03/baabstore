import React, { useState } from 'react';
import { Plus, LayoutGrid, Package, Filter, Megaphone, Settings as SettingsIcon } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import { Product } from '../types/product';
import { ProductForm } from './ProductForm';
import { HomeSectionManager } from './HomeSectionManager';
import { CategoryManager } from './CategoryManager';
import { CategoryTitleManager } from './CategoryTitleManager';
import { ProductList } from './ProductList';
import { AnnouncementManager } from './AnnouncementManager';
import { LogoManager } from './LogoManager';
import { FeaturedCategoryManager } from './FeaturedCategoryManager';

export const AdminPanel: React.FC = () => {
  const { products, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'homepage' | 'categories' | 'announcements' | 'settings' | 'featured'>('products');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const filteredProducts = products.filter(product => {
    if (!selectedCategory) return true;
    if (!selectedSubcategory) return product.category === selectedCategory;
    return product.category === selectedCategory && product.subcategory === selectedSubcategory;
  });

  const currentCategory = categories.find(cat => cat.name === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="fixed top-32 left-0 right-0 bg-white z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex gap-4 border-b overflow-x-auto">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Package size={20} />
                Ürünler
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 whitespace-nowrap ${
                  activeTab === 'categories'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Filter size={20} />
                Kategoriler
              </button>
              <button
                onClick={() => setActiveTab('homepage')}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 whitespace-nowrap ${
                  activeTab === 'homepage'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <LayoutGrid size={20} />
                Ana Sayfa Görselleri
              </button>
              <button
                onClick={() => setActiveTab('announcements')}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 whitespace-nowrap ${
                  activeTab === 'announcements'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Megaphone size={20} />
                Duyurular
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <SettingsIcon size={20} />
                Site Ayarları
              </button>
              <button
                onClick={() => setActiveTab('featured')}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 whitespace-nowrap ${
                  activeTab === 'featured'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <LayoutGrid size={20} />
                Öne Çıkan Kategoriler
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="pt-[140px]">
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800">Ürün Yönetimi</h2>
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedSubcategory('');
                    }}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Tüm Kategoriler</option>
                    {categories.map(category => (
                      <option key={category.name} value={category.name}>
                        {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                      </option>
                    ))}
                  </select>
                  {currentCategory && (
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Tüm Alt Kategoriler</option>
                      {currentCategory.subcategories.map(subcategory => (
                        <option key={subcategory} value={subcategory}>
                          {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsFormOpen(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <Plus size={20} />
                Yeni Ürün Ekle
              </button>
            </div>

            <div className="overflow-x-auto">
              <ProductList
                products={filteredProducts}
                onEdit={handleEdit}
                onDelete={deleteProduct}
              />
            </div>

            {isFormOpen && (
              <ProductForm
                product={editingProduct}
                onClose={() => {
                  setIsFormOpen(false);
                  setEditingProduct(null);
                }}
                initialCategory={selectedCategory}
                initialSubcategory={selectedSubcategory}
              />
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-8">
            <CategoryManager />
            <CategoryTitleManager />
          </div>
        )}
        
        {activeTab === 'homepage' && <HomeSectionManager />}
        {activeTab === 'announcements' && <AnnouncementManager />}
        {activeTab === 'settings' && <LogoManager />}
        {activeTab === 'featured' && <FeaturedCategoryManager />}
      </div>
    </div>
  );
};