import React from 'react';
import { ProductCard } from './ProductCard';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types/product';

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onAddToCart, onViewDetails }) => {
  const { products } = useProducts();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};