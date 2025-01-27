import React from 'react';
import { X, Trash2, ShoppingCart, Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoriteContext';
import { useNavigate } from 'react-router-dom';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({ isOpen, onClose }) => {
  const { favorites, removeFromFavorites } = useFavorites();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleRemove = async (productId: string) => {
    try {
      await removeFromFavorites(productId);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-gray-700" fill="currentColor" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Favorilerim
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({favorites.length} ürün)
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {favorites.length === 0 ? (
            <div className="text-center py-8">
              <Heart size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-6">
                Henüz favori ürününüz bulunmuyor
                <br />
                <span className="text-sm">
                  Beğendiğiniz ürünleri favorilerinize ekleyerek takip edebilirsiniz
                </span>
              </p>
              <button
                onClick={() => {
                  navigate('/');
                  onClose();
                }}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto"
              >
                <ShoppingCart size={18} />
                Alışverişe Başla
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((favorite) => (
                <div
                  key={favorite.product_id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <img
                    src={(favorite.products as any).images[0]}
                    alt={(favorite.products as any).name}
                    className="w-full sm:w-20 h-40 sm:h-20 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleProductClick(favorite.product_id)}
                  />
                  <div className="flex-1 w-full">
                    <h3 
                      className="font-medium text-gray-900 cursor-pointer hover:text-gray-600 line-clamp-2"
                      onClick={() => handleProductClick(favorite.product_id)}
                    >
                      {(favorite.products as any).name}
                    </h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {(favorite.products as any).price.toLocaleString('tr-TR', {
                        style: 'currency',
                        currency: 'TRY'
                      })}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => handleRemove(favorite.product_id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => handleProductClick(favorite.product_id)}
                        className="flex-1 py-2 px-4 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={16} />
                        Satın Al
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 