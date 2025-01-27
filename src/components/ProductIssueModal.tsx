import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase/supabase';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

interface ProductIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Product {
  id: string;
  name: string;
}

export const ProductIssueModal: React.FC<ProductIssueModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    product_id: ''
  });

  // Ürünleri yükle
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name');

      if (!error && data) {
        setProducts(data);
      }
    };

    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submit başladı');
    setIsLoading(true);

    try {
      if (!user) {
        console.error('Kullanıcı bulunamadı:', user);
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      console.log('Kullanıcı ID:', user.id);
      console.log('Form verileri:', formData);

      // Form validasyonu
      if (!formData.product_id) {
        throw new Error('Lütfen bir ürün seçin');
      }
      if (!formData.title.trim()) {
        throw new Error('Lütfen bir başlık girin');
      }
      if (!formData.description.trim()) {
        throw new Error('Lütfen bir açıklama girin');
      }

      const issueData = {
        user_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        product_id: formData.product_id,
        status: 'active'
      };

      console.log('Gönderilecek veri:', issueData);

      const { data, error } = await supabase
        .from('issue_reporting')
        .insert(issueData)
        .select();

      if (error) {
        console.error('Supabase hatası:', error);
        console.error('Hata detayı:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('Veri başarıyla eklendi:', data);
      toast.success('Sorun talebiniz başarıyla oluşturuldu');
      onSuccess();
      setFormData({ title: '', description: '', product_id: '' });
    } catch (error: any) {
      console.error('Hata detayı:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        cause: error.cause
      });
      toast.error(error.message || 'Sorun oluşturulurken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">Sorun Talep Oluştur</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İlgili Ürün
            </label>
            <select
              value={formData.product_id}
              onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Ürün Seçin</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sorun Başlığı
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent"
              placeholder="Sorununuzu kısaca özetleyin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sorun Açıklaması
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent h-32"
              placeholder="Sorununuzu detaylı bir şekilde açıklayın"
              required
            />
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
              {isLoading ? 'Gönderiliyor...' : 'Talebi Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 