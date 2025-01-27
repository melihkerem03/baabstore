import React from 'react';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types/product';

interface DiscountedProductsProps {
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const DiscountedProducts: React.FC<DiscountedProductsProps> = ({
  onAddToCart,
  onViewDetails
}) => {
  const { products } = useProducts();
  const discountedProducts = products.filter(p => p.discount && p.discount > 0);

  if (discountedProducts.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          İndirimli Ürünler
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {discountedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </div>
    </section>
  );
};