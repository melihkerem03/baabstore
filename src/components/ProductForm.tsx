import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus } from 'lucide-react';
import { Product, Category } from '../types/product';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  initialCategory?: string;
  initialSubcategory?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  onClose, 
  initialCategory = '',
  initialSubcategory = ''
}) => {
  const { addProduct, updateProduct } = useProducts();
  const { categories } = useCategories();
  
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'created_at' | 'updated_at' | 'discounted_price'>>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    image: product?.image || '',
    stock: product?.stock || 0,
    category: initialCategory || product?.category || '',
    subcategory: initialSubcategory || product?.subcategory || '',
    discount: product?.discount || 0,
    images: product?.images || []
  });

  const [imageUrls, setImageUrls] = useState<string[]>(product?.images || []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        images: product.images || [],
        stock: product.stock,
        category: product.category,
        subcategory: product.subcategory,
        discount: product.discount || 0
      });
      setImageUrls(product.images || []);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        discount: Number(formData.discount || 0)
      };

      console.log('Gönderilecek ürün verisi:', productData);

      if (product) {
        await updateProduct({
          ...productData,
          id: product.id
        });
      } else {
        // @ts-ignore - discounted_price Supabase tarafında hesaplanacak
        await addProduct(productData);
      }
      
      onClose();
    } catch (error) {
      console.error('Ürün kaydedilirken detaylı hata:', error);
      
      if (error instanceof Error) {
        alert(`Ürün kaydedilirken bir hata oluştu: ${error.message}`);
      } else {
        alert('Ürün kaydedilirken beklenmeyen bir hata oluştu!');
      }
    }
  };

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUrlAdd = () => {
    setImageUrls(prev => [...prev, '']);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
    setFormData(prev => ({
      ...prev,
      images: newUrls.filter(url => url.trim() !== '')
    }));
  };

  const handleImageUrlRemove = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: imageUrls.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ürün Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Fiyat (TL)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">İndirim (%)</label>
                <input
                  type="number"
                  value={formData.discount || 0}
                  onChange={(e) => handleChange('discount', parseInt(e.target.value) || 0)}
                  min="0"
                  max="100"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Stok</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    handleChange('category', e.target.value);
                    handleChange('subcategory', '');
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map((category: Category) => (
                    <option key={category.name} value={category.name}>
                      {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {formData.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Alt Kategori</label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => handleChange('subcategory', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Alt Kategori Seçin</option>
                    {categories
                      .find((cat: Category) => cat.name === formData.category)
                      ?.subcategories.map((sub: string) => (
                        <option key={sub} value={sub}>
                          {sub.charAt(0).toUpperCase() + sub.slice(1)}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Görsel URL'si
                </label>
                <div className="mt-1 space-y-2">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleChange('image', e.target.value)}
                    placeholder="https://images.unsplash.com/photo-xxx"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-gray-50">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Ürün önizleme"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error('Görsel yükleme hatası:', e);
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Görsel+Yüklenemedi';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <p>Görsel URL'si girin</p>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Geçerli bir görsel URL'si girin (örn: https://images.unsplash.com/...)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ek Görsel URL'leri
                </label>
                <div className="mt-1 space-y-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => handleImageUrlChange(index, e.target.value)}
                          placeholder="https://images.unsplash.com/photo-xxx"
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageUrlRemove(index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      {url && (
                        <div className="relative h-32 border rounded-lg overflow-hidden bg-gray-50">
                          <img
                            src={url}
                            alt={`Ürün görseli ${index + 1}`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              console.error('Görsel yükleme hatası:', e);
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Görsel+Yüklenemedi';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleImageUrlAdd}
                    className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Yeni Görsel Ekle
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {product ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};