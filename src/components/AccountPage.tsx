import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { supabase } from '../lib/supabase/supabase';
import { 
  UserCircle, 
  Package, 
  MapPin, 
  MessageCircle, 
  LogOut 
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setUserData(data);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  const menuItems = [
    {
      title: 'Kişisel Bilgilerim',
      icon: <UserCircle size={24} />,
      path: '/account/profile',
    },
    {
      title: 'Siparişlerim',
      icon: <Package size={24} />,
      path: '/account/orders',
    },
    {
      title: 'Adres Bilgilerim',
      icon: <MapPin size={24} />,
      path: '/account/addresses',
    },
    {
      title: 'Ürün Sorularım',
      icon: <MessageCircle size={24} />,
      path: '/account/issues',
    }
  ];

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
        <div className="max-w-4xl mx-auto px-4">
          {/* Profil Başlığı */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6 text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle size={48} className="text-gray-400" />
                )}
              </div>
            </div>
            <h1 className="text-2xl font-medium text-gray-900 mb-2">
              Hoş geldiniz, {userData?.name || 'Kullanıcı'}
            </h1>
            <p className="text-gray-500">{userData?.email}</p>
          </div>

          {/* Menü Butonları */}
          <div className="grid gap-4 md:grid-cols-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow 
                         flex items-center gap-4 w-full text-left"
              >
                <div className="text-gray-600">{item.icon}</div>
                <span className="font-medium text-gray-900">{item.title}</span>
              </button>
            ))}
            
            {/* Çıkış Yap Butonu */}
            <button
              onClick={handleLogout}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow 
                       flex items-center gap-4 w-full text-left text-red-600"
            >
              <LogOut size={24} />
              <span className="font-medium">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}; 