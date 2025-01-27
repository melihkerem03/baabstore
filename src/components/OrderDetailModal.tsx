import React from 'react';
import { X, Truck, MapPin, Package } from 'lucide-react';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-medium">Sipariş Detayı</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Sipariş Özeti */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Sipariş Numarası</div>
                <div className="font-medium">#SP123456789</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Sipariş Tarihi</div>
                <div className="font-medium">15 Mart 2024</div>
              </div>
            </div>
          </div>

          {/* Kargo Durumu */}
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Truck size={20} className="text-green-600" />
              <span className="font-medium">Kargo Durumu</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Teslim Edildi</span>
                <span className="text-sm text-gray-500">17 Mart 2024, 14:30</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Dağıtıma Çıktı</span>
                <span className="text-sm text-gray-500">17 Mart 2024, 09:15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Kargoya Verildi</span>
                <span className="text-sm text-gray-500">16 Mart 2024, 16:45</span>
              </div>
            </div>
          </div>

          {/* Teslimat Adresi */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={20} />
              <span className="font-medium">Teslimat Adresi</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-medium mb-2">Ev Adresim</div>
              <div className="text-sm text-gray-600">
                Melih Kerem Aydın<br />
                Örnek Mahallesi, Örnek Sokak No:1 D:2<br />
                Kadıköy/İstanbul
              </div>
            </div>
          </div>

          {/* Ürün Detayları */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Package size={20} />
              <span className="font-medium">Ürün Detayları</span>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-md">
                    <img 
                      src="https://via.placeholder.com/80" 
                      alt="Ürün"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Premium Siyah T-Shirt</h3>
                    <div className="text-sm text-gray-500">Beden: M</div>
                    <div className="text-sm text-gray-500">Adet: 1</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₺499,90</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ödeme Detayları */}
          <div className="border-t pt-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ara Toplam</span>
                <span>₺499,90</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Kargo Ücreti</span>
                <span>₺29,90</span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-3 border-t">
                <span>Toplam</span>
                <span>₺529,80</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 