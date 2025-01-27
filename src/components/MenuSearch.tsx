import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types/product';

interface MenuSearchProps {
  onProductSelect: (product: Product) => void;
  onClose: () => void;
}

export const MenuSearch: React.FC<MenuSearchProps> = ({ onProductSelect, onClose }) => {
  const { products } = useProducts();
  const [query, setQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (query.trim()) {
      const results = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  }, [query, products]);

  const handleSelect = (product: Product) => {
    onProductSelect(product);
    setQuery('');
    onClose();
  };

  return (
    <div className="px-6 py-4">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ürün ara..."
          className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      {filteredProducts.length > 0 && (
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          <div className="grid gap-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product)}
                className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {product.price.toLocaleString('tr-TR', {
                      style: 'currency',
                      currency: 'TRY'
                    })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {query && filteredProducts.length === 0 && (
        <div className="mt-4 text-center text-gray-500">
          Sonuç bulunamadı
        </div>
      )}
    </div>
  );
};