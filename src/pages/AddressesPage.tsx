import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase/supabase';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Plus, Home, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddressModal } from '../components/AddressModal';

interface Address {
  id: string;
  user_id: string;
  title: string;
  full_name: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string;
  address_line: string;
  postal_code?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const AddressesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user!.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      toast.error('Adresler yüklenirken bir hata oluştu');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  const handleAddNewAddress = () => {
    setSelectedAddress(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <Header 
        cartItemCount={0}
        isAdminView={false}
        onToggleView={() => {}}
        onShowAllProducts={() => {}}
        showAllProducts={false}
        onCategorySelect={() => {}}
        onShowHome={() => window.location.href = '/'}
        onCartClick={() => {}}
        onProductSelect={() => {}}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24">
        <div className="max-w-3xl mx-auto px-4">
          {/* Geri Butonu */}
          <button
            onClick={() => navigate('/account')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 
                     transition-colors duration-200 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Hesabım</span>
          </button>

          {/* Başlık ve Yeni Adres Ekleme Butonu */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Adres Bilgilerim</h1>
            <button
              onClick={handleAddNewAddress}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg
                       hover:bg-gray-800 transition-colors duration-200"
            >
              <Plus size={20} />
              <span>Yeni Adres Ekle</span>
            </button>
          </div>

          {/* Adres Listesi */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Yükleniyor...</div>
            ) : addresses.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                <Home size={40} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Henüz kayıtlı adresiniz bulunmuyor.</p>
              </div>
            ) : (
              addresses.map((address) => (
                <div 
                  key={address.id}
                  className="bg-white rounded-xl p-6 border border-gray-200 relative"
                >
                  {address.is_default && (
                    <span className="absolute top-4 right-16 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Varsayılan
                    </span>
                  )}
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <div className="pr-20">
                    <h3 className="font-medium text-gray-900">{address.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{address.full_name}</p>
                    <div className="space-y-2 text-sm text-gray-600 mt-2">
                      <p>{address.phone}</p>
                      <p>
                        {address.address_line}, {address.neighborhood}
                      </p>
                      <p>
                        {address.district}/{address.city}
                        {address.postal_code && ` - ${address.postal_code}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Adres Modalı */}
      <AddressModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAddress(null);
        }}
        address={selectedAddress}
        onSuccess={() => {
          setIsModalOpen(false);
          setSelectedAddress(null);
          fetchAddresses();
        }}
      />
    </>
  );
}; 