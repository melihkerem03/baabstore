import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types/product';

interface SearchBarProps {
  onProductSelect: (product: Product) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onProductSelect }) => {
  const { products } = useProducts();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase()) ||
    product.subcategory.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = (product: Product) => {
    onProductSelect(product);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="w-[90%] mx-auto" ref={searchRef}>
      <div className="relative max-w-2xl mx-auto">
        <div className="relative" style={{ marginTop: '-50px' }}>
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Ürün ara..."
            className="w-full pl-12 pr-4 py-3 bg-transparent backdrop-blur-sm rounded-lg 
                     border border-gray-200/50 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:border-transparent text-white
                     placeholder-gray-300 shadow-lg"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300" size={20} />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {isOpen && query && (
          <div className="absolute bottom-full mb-2 w-full bg-black/80 backdrop-blur-sm 
                        border border-gray-200/20 max-h-96 overflow-y-auto rounded-lg">
            {filteredProducts.length > 0 ? (
              <ul className="py-2">
                {filteredProducts.map((product) => (
                  <li key={product.id}>
                    <button
                      onClick={() => handleSelect(product)}
                      className="w-full px-4 py-2 hover:bg-white/10 flex items-center gap-3 text-left"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium text-white">{product.name}</h4>
                        <p className="text-sm text-gray-300">
                          {product.category} / {product.subcategory}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-300">
                Sonuç bulunamadı
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};