import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase/supabase';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  address?: Address | null;
}

interface Address {
  id?: string;
  title: string;
  full_name: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string;
  address_line: string;
  postal_code?: string;
  is_default: boolean;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  address
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Address>({
    title: '',
    full_name: '',
    phone: '',
    city: '',
    district: '',
    neighborhood: '',
    address_line: '',
    postal_code: '',
    is_default: false
  });

  useEffect(() => {
    if (address) {
      setFormData(address);
    } else {
      setFormData({
        title: '',
        full_name: '',
        phone: '',
        city: '',
        district: '',
        neighborhood: '',
        address_line: '',
        postal_code: '',
        is_default: false
      });
    }
  }, [address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.is_default) {
        // Eğer yeni adres varsayılan olarak işaretlendiyse, diğer adreslerin varsayılan durumunu kaldır
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user!.id);
      }

      if (address?.id) {
        // Mevcut adresi güncelle
        const { error } = await supabase
          .from('addresses')
          .update({
            ...formData,
            updated_at: new Date()
          })
          .eq('id', address.id);

        if (error) throw error;
        toast.success('Adres başarıyla güncellendi');
      } else {
        // Yeni adres ekle
        const { error } = await supabase
          .from('addresses')
          .insert([
            {
              ...formData,
              user_id: user!.id,
              created_at: new Date(),
              updated_at: new Date()
            }
          ]);

        if (error) throw error;
        toast.success('Yeni adres başarıyla eklendi');
      }

      onSuccess();
    } catch (error) {
      console.error('Adres kaydedilirken hata:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">
            {address ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adres Başlığı
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent"
                placeholder="Örn: Ev, İş"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ad Soyad
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent"
                placeholder="5XX XXX XX XX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İl
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İlçe
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mahalle
              </label>
              <input
                type="text"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açık Adres
            </label>
            <textarea
              value={formData.address_line}
              onChange={(e) => setFormData({ ...formData, address_line: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent h-24"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Posta Kodu
            </label>
            <input
              type="text"
              value={formData.postal_code}
              onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent"
              placeholder="İsteğe bağlı"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.is_default}
              onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
              Bu adresi varsayılan olarak ayarla
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl 
                       hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 
                       transition-colors disabled:bg-gray-400"
            >
              {isLoading ? 'Kaydediliyor...' : address ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 