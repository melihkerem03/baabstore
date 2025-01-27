import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AddressModal } from './AddressModal';
import { supabase } from '../lib/supabase/supabase';
import { Trash2, Plus, MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Address {
  id: string;
  title: string;
  full_name: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string;
  address_line: string;
  postal_code: string | null;
  is_default: boolean;
}

export const AddressInformation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAddresses = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) {
        console.error('Error fetching addresses:', error);
        throw error;
      }

      setAddresses(data || []);
    } catch (error) {
      console.error('Error loading addresses:', error);
      alert('Adresler yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Bu adresi silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;
      await fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Adres silinirken bir hata oluştu');
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      if (error) throw error;
      await fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Varsayılan adres ayarlanırken bir hata oluştu');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/account')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-2xl font-semibold">Adres Bilgilerim</h2>
            </div>
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              <Plus size={20} />
              Yeni Adres Ekle
            </button>
          </div>
        </div>

        {/* Address List */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-gray-600">Adresler yükleniyor...</p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
              <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz adres eklenmemiş</h3>
              <p className="text-gray-500 mb-4">Yeni bir adres ekleyerek başlayın</p>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                <Plus size={20} />
                Yeni Adres Ekle
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="border rounded-lg p-6 relative hover:border-gray-300 transition-colors"
                >
                  {address.is_default && (
                    <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Varsayılan Adres
                    </span>
                  )}
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium mb-2">{address.title}</h3>
                      <div className="space-y-2 text-gray-600">
                        <p className="font-medium">{address.full_name}</p>
                        <p>{address.phone}</p>
                        <p>
                          {address.address_line}, {address.neighborhood}
                          <br />
                          {address.district}/{address.city}
                          {address.postal_code && ` - ${address.postal_code}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {!address.is_default && (
                        <button
                          onClick={() => handleSetDefaultAddress(address.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Varsayılan Yap
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          fetchAddresses();
        }}
        onAddressAdded={fetchAddresses}
      />
    </div>
  );
}; 