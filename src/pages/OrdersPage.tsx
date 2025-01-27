import React from 'react';
import { Header } from '../components/Header';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header 
        cartItemCount={0}
        isAdminView={false}
        onToggleView={() => {}}
        onShowAllProducts={() => {}}
        showAllProducts={false}
        onCategorySelect={() => {}}
        onShowHome={() => window.location.href = '/'}
        onCartClick={() => {}}
        onProductSelect={() => {}}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24">
        <div className="max-w-3xl mx-auto px-4">
          {/* Geri Butonu */}
          <button
            onClick={() => navigate('/account')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 
                     transition-colors duration-200 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Hesabım</span>
          </button>

          {/* Sayfa İçeriği */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Siparişlerim</h1>
            {/* İçerik buraya gelecek */}
          </div>
        </div>
      </div>
    </>
  );
}; 