import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  if (!isOpen) return null;

  const calculateItemPrice = (item: any) => {
    const basePrice = item.products.price * item.quantity;
    const discount = item.products.discount || 0;
    return basePrice * (1 - discount / 100);
  };

  const calculateOriginalPrice = (item: any) => {
    return item.products.price * item.quantity;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Alışveriş Sepeti</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Sepetiniz boş</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.products.image}
                    alt={item.products.name}
                    className="w-full sm:w-20 h-40 sm:h-20 object-cover rounded-md"
                  />
                  <div className="flex-1 w-full">
                    <h3 className="font-medium text-gray-900">{item.products.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{item.products.description}</p>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-200"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-200"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                        <div className="flex flex-col items-end">
                          {item.products.discount > 0 ? (
                            <>
                              <span className="text-sm text-gray-500 line-through">
                                {calculateOriginalPrice(item).toLocaleString('tr-TR', {
                                  style: 'currency',
                                  currency: 'TRY'
                                })}
                              </span>
                              <span className="font-medium text-gray-900">
                                {calculateItemPrice(item).toLocaleString('tr-TR', {
                                  style: 'currency',
                                  currency: 'TRY'
                                })}
                              </span>
                            </>
                          ) : (
                            <span className="font-medium text-gray-900">
                              {calculateOriginalPrice(item).toLocaleString('tr-TR', {
                                style: 'currency',
                                currency: 'TRY'
                              })}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">Toplam:</span>
              <span className="text-xl font-bold text-gray-900">
                {total.toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY'
                })}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                onClick={clearCart}
                className="w-full px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
              >
                Sepeti Temizle
              </button>
              <button
                onClick={() => {
                  // Implement checkout logic here
                  alert('Ödeme işlemi başlatılıyor...');
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Ödemeye Geç
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};