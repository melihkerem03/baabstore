import React, { useState, useRef } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types/product';
import { useFavorites } from '../context/FavoriteContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart,
  onViewDetails
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const isFav = isFavorite(product.id);

  // İlk 4 görseli al
  const displayImages = product.images.slice(0, 4);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || displayImages.length <= 1) return;

    // Butonların olduğu alanı kontrol et
    const target = e.target as HTMLElement;
    if (target.closest('.action-buttons')) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const sectionWidth = width / displayImages.length;
    
    const newIndex = Math.min(
      Math.floor(x / sectionWidth),
      displayImages.length - 1
    );
    
    if (newIndex !== currentImageIndex) {
      setCurrentImageIndex(newIndex);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Tıklama event'ini durdur
    try {
      if (isFav) {
        await removeFromFavorites(product.id);
      } else {
        await addToFavorites(product.id);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div 
      className="bg-white cursor-pointer group border border-black relative"
      onClick={() => onViewDetails(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      {(product.discount ?? 0) > 0 && (
        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-sm font-bold rounded-md z-10">
          %{product.discount} İndirim
        </div>
      )}
      <div 
        ref={imageContainerRef}
        className="relative"
        onMouseMove={handleMouseMove}
      >
        <img
          src={displayImages[currentImageIndex] || product.images[0]}
          alt={product.name}
          className="w-full aspect-square object-cover transition-all duration-500 ease-in-out"
        />
        <div className="action-buttons absolute bottom-8 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={handleAddToCart}
            className="p-2 bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm rounded-sm transition-colors"
          >
            <ShoppingCart size={20} />
          </button>
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full ${isFav ? 'text-red-500' : 'text-gray-400'}`}
          >
            <Heart fill={isFav ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        {/* Progress Bar */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 flex gap-0.5 p-2 justify-center">
            {displayImages.map((_, index) => (
              <div
                key={index}
                className={`h-0.5 flex-1 transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-black' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}

        {/* Görünmez Bölge Çizgileri (Debug için) */}
        {isHovered && displayImages.length > 1 && (
          <div className="absolute inset-0 flex">
            {displayImages.map((_, index) => (
              <div
                key={index}
                className="flex-1 border-r border-transparent last:border-0"
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-black">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-4">
          {product.name}
        </h3>
        {(product.discount ?? 0) > 0 ? (
          <div className="flex flex-col">
            <span className="text-base text-gray-500 line-through mb-1">
              {product.price.toLocaleString('tr-TR', {
                style: 'currency',
                currency: 'TRY'
              })}
            </span>
            <div className="bg-gray-100 inline-block px-3 py-2 rounded">
              <div className="text-xs text-gray-500 mb-0.5">İndirimli Fiyat</div>
              <div className="text-xl font-medium text-black">
                {(product.price * (1 - ((product.discount ?? 0) / 100))).toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY'
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xl">
            {product.price.toLocaleString('tr-TR', {
              style: 'currency',
              currency: 'TRY'
            })}
          </div>
        )}
      </div>
    </div>
  );
};