import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AddressModal } from '../components/AddressModal';
import { CartModal } from '../components/CartModal';
import { supabase } from '../lib/supabase/supabase';
import { Trash2, Plus, MapPin, User, Package, MessageCircle, LogOut, ShoppingCart } from 'lucide-react';
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

export const AccountPage = () => {
  const { user, logout } = useAuth();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAddresses = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching addresses:', error);
        throw error;
      }

      console.log('Fetched addresses:', data); // Debug log
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
      await fetchAddresses(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Adres silinirken bir hata oluştu');
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      // First, remove default from all addresses
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      // Then set the new default
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      if (error) throw error;
      await fetchAddresses(); // Refresh the list after update
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Varsayılan adres ayarlanırken bir hata oluştu');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r min-h-screen">
        {/* User Info */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h1 className="text-lg font-medium">Hoş geldiniz, {user.name}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="py-4">
          <button
            onClick={() => {}}
            className="w-full px-6 py-3 flex items-center gap-3 text-gray-700 hover:bg-gray-50"
          >
            <User className="w-5 h-5" />
            <span>Kişisel Bilgilerim</span>
          </button>

          <button
            onClick={() => {}}
            className="w-full px-6 py-3 flex items-center gap-3 text-gray-700 hover:bg-gray-50"
          >
            <Package className="w-5 h-5" />
            <span>Siparişlerim</span>
          </button>

          <button
            onClick={() => navigate('/address-information')}
            className="w-full px-6 py-3 flex items-center gap-3 text-gray-700 hover:bg-gray-50 relative"
          >
            <MapPin className="w-5 h-5" />
            <span>Adres Bilgilerim</span>
          </button>

          <button
            onClick={() => setIsCartModalOpen(true)}
            className="w-full px-6 py-3 flex items-center gap-3 text-gray-700 hover:bg-gray-50"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Sepetim</span>
          </button>

          <button
            onClick={() => {}}
            className="w-full px-6 py-3 flex items-center gap-3 text-gray-700 hover:bg-gray-50"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Ürün Sorularım</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 flex items-center gap-3 text-gray-700 hover:bg-gray-50"
          >
            <LogOut className="w-5 h-5" />
            <span>Çıkış Yap</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Kayıtlı Adreslerim</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Address Card */}
            <div 
              onClick={() => navigate('/address-information')}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-medium">Adres Bilgilerim</h2>
                  <p className="text-sm text-gray-500">Kayıtlı adreslerinizi yönetin</p>
                </div>
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-medium">Siparişlerim</h2>
                  <p className="text-sm text-gray-500">Sipariş geçmişinizi görüntüleyin</p>
                </div>
              </div>
            </div>

            {/* Product Issues Card */}
            <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-medium">Ürün Sorularım</h2>
                  <p className="text-sm text-gray-500">Ürünlerle ilgili sorularınızı yönetin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          fetchAddresses(); // Refresh addresses when modal closes
        }}
        onAddressAdded={fetchAddresses}
      />

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />
    </div>
  );
}; 