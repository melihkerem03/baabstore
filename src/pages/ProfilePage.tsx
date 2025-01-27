import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase/supabase';
import { toast } from 'react-hot-toast';
import { UserCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    birthDate: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          toast.error('Kullanıcı bilgileri alınamadı');
          return;
        }

        if (data) {
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            gender: data.gender || '',
            birthDate: data.birth_date || ''
          });
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          phone: formData.phone,
          gender: formData.gender,
          birth_date: formData.birthDate,
          updated_at: new Date()
        })
        .eq('id', user!.id);

      if (error) throw error;
      toast.success('Profil bilgileriniz güncellendi');
    } catch (error) {
      toast.error('Bir hata oluştu');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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

          {/* Profil Başlığı */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle size={40} className="text-gray-400" />
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">Kişisel Bilgilerim</h1>
                <p className="text-gray-500">Profil bilgilerinizi buradan güncelleyebilirsiniz</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 
                               focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                    />
                    <p className="text-sm text-gray-400 mt-2">E-posta adresi değiştirilemez</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 
                               focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="5XX XXX XX XX"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cinsiyet
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 
                               focus:ring-blue-500 focus:border-transparent transition-all duration-200 
                               appearance-none bg-white"
                    >
                      <option value="">Seçiniz</option>
                      <option value="male">Erkek</option>
                      <option value="female">Kadın</option>
                      <option value="other">Diğer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Doğum Tarihi
                    </label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 
                               focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl
                           hover:from-blue-700 hover:to-blue-800 transition-all duration-200 
                           disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed
                           shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg font-medium"
                >
                  {isLoading ? (
                    'Güncelleniyor...'
                  ) : (
                    <>
                      Bilgilerimi Güncelle
                      <ChevronRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}; 