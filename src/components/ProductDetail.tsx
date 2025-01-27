import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import { Product } from '../types/product';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
}

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left"
      >
        <span className="text-lg font-medium">{title}</span>
        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
      </button>
      {isOpen && (
        <div className="pb-4">
          {children}
        </div>
      )}
    </div>
  );
};

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onAddToCart,
  onBack,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const image = e.currentTarget;
    const rect = image.getBoundingClientRect();
    
    // Calculate relative position (0-1)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Update zoom position
    setZoomPosition({ x, y });
  };

  // Örnek ödeme seçenekleri - gerçek verilerle değiştirilecek
  const paymentOptions = [
    { bank: "Garanti", installments: [
      { months: 3, amount: (product.price / 3).toFixed(2) },
      { months: 6, amount: (product.price / 6).toFixed(2) },
      { months: 9, amount: (product.price / 9).toFixed(2) }
    ]},
    { bank: "Yapı Kredi", installments: [
      { months: 3, amount: (product.price / 3).toFixed(2) },
      { months: 6, amount: (product.price / 6).toFixed(2) },
      { months: 9, amount: (product.price / 9).toFixed(2) }
    ]},
    { bank: "İş Bankası", installments: [
      { months: 3, amount: (product.price / 3).toFixed(2) },
      { months: 6, amount: (product.price / 6).toFixed(2) },
      { months: 9, amount: (product.price / 9).toFixed(2) }
    ]}
  ];

  return (
    <div className="bg-white min-h-screen pt-32">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Geri
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Left Side - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative">
              <div 
                className="aspect-square overflow-hidden bg-gray-100 border cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => {
                  setIsZoomed(false);
                  setZoomPosition({ x: 0, y: 0 });
                }}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Zoomed Image Overlay */}
              {isZoomed && (
                <div 
                  className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
                  style={{
                    clipPath: 'inset(0)',
                  }}
                >
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    className="absolute w-[200%] h-[200%] max-w-none object-cover transition-transform duration-0"
                    style={{
                      transform: `translate(${-zoomPosition.x * 100}%, ${-zoomPosition.y * 100}%) scale(2)`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square border overflow-hidden ${
                    selectedImageIndex === index
                      ? 'border-black'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - Görsel ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div className="lg:sticky lg:top-8 space-y-6">
            <div className="border-b pb-6">
              <h1 className="text-2xl font-medium text-gray-900 mb-4">
                {product.name}
              </h1>
              
              {/* Price */}
              <div className="space-y-2">
                {(product.discount ?? 0) > 0 ? (
                  <>
                    <div className="text-lg text-gray-500 line-through">
                      {product.price.toLocaleString('tr-TR', {
                        style: 'currency',
                        currency: 'TRY'
                      })}
                    </div>
                    <div className="bg-gray-100 inline-block px-4 py-2 rounded">
                      <div className="text-sm text-gray-500">İndirimli Fiyat</div>
                      <div className="text-2xl font-medium text-black">
                        {(product.price * (1 - ((product.discount ?? 0) / 100))).toLocaleString('tr-TR', {
                          style: 'currency',
                          currency: 'TRY'
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-2xl font-medium text-black">
                    {product.price.toLocaleString('tr-TR', {
                      style: 'currency',
                      currency: 'TRY'
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={() => onAddToCart(product)}
                className="w-full bg-black text-white py-4 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart size={20} />
                Sepete Ekle
              </button>
              
              <button className="w-full border border-black py-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <Heart size={20} />
                Favorilere Ekle
              </button>
            </div>

            {/* Quick Info */}
            <div className="border-t pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Kategori</div>
                  <div className="text-gray-600">{product.category}</div>
                </div>
                <div>
                  <div className="font-medium">Alt Kategori</div>
                  <div className="text-gray-600">{product.subcategory}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="max-w-3xl mx-auto mb-12">
          <Accordion title="ÜRÜN ÖZELLİKLERİ">
            <div className="prose prose-sm max-w-none">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Kumaş</td>
                    <td className="py-2">{product.fabric || 'Belirtilmemiş'}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Renk</td>
                    <td className="py-2">{product.color || 'Belirtilmemiş'}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Desen</td>
                    <td className="py-2">{product.pattern || 'Belirtilmemiş'}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Ürün Kodu</td>
                    <td className="py-2">{product.code || 'Belirtilmemiş'}</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4">
                <p>{product.description}</p>
              </div>
            </div>
          </Accordion>

          <Accordion title="ÖDEME SEÇENEKLERİ">
            <div className="space-y-6">
              {paymentOptions.map((bank, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">{bank.bank}</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Taksit Sayısı</th>
                        <th className="text-right py-2">Aylık Tutar</th>
                        <th className="text-right py-2">Toplam Tutar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bank.installments.map((installment, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="py-2">{installment.months} Taksit</td>
                          <td className="text-right py-2">
                            {Number(installment.amount).toLocaleString('tr-TR', {
                              style: 'currency',
                              currency: 'TRY'
                            })}
                          </td>
                          <td className="text-right py-2">
                            {product.price.toLocaleString('tr-TR', {
                              style: 'currency',
                              currency: 'TRY'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
};