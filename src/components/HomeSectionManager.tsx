import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useCategories } from '../context/CategoryContext';
import { supabase } from '../lib/supabase/supabase';
import { HomeSection } from '../types/homeSection';

export const HomeSectionManager = () => {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<HomeSection | null>(null);
  const { categories } = useCategories();

  const [formData, setFormData] = useState<HomeSection>({
    id: '',
    title: '',
    subtitle: '',
    image: '',
    category: '',
    buttonText: 'KEŞFET',
    targetSubcategory: ''
  });

  // Sections'ları yükle
  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      console.log('Sections yükleniyor...');
      const { data, error } = await supabase
        .from('home_sections')
        .select('*, categories(name)')
        .order('order', { ascending: true });

      if (error) {
        console.error('Sections yükleme hatası:', error);
        throw error;
      }

      console.log('Alınan veri:', data);
      
      const mappedSections = (data || []).map(section => ({
        id: section.id,
        title: section.title,
        subtitle: section.subtitle,
        image: section.image,
        category: section.category,
        buttonText: section.button_text || 'KEŞFET',
        targetSubcategory: section.target_subcategory,
        order: section.order
      }));

      console.log('Dönüştürülmüş veri:', mappedSections);
      setSections(mappedSections);
    } catch (error) {
      console.error('Tam hata:', error);
      handleError(error, 'Sections yüklenirken bir hata oluştu!');
    }
  };

  const handleError = (error: any, message: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(message, error);
    }
    alert(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate category exists
      const categoryExists = categories.some(cat => cat.name === formData.category);
      if (!categoryExists) {
        throw new Error('Selected category does not exist');
      }

      // Validate subcategory exists in the selected category
      const selectedCategory = categories.find(cat => cat.name === formData.category);
      if (!selectedCategory?.subcategories.includes(formData.targetSubcategory)) {
        throw new Error('Selected subcategory does not exist in the category');
      }

      const sectionData = {
        title: formData.title,
        subtitle: formData.subtitle,
        image: formData.image,
        category: formData.category,
        button_text: formData.buttonText,
        target_subcategory: formData.targetSubcategory,
        order: sections.length + 1
      };

      console.log('Gönderilen veri:', sectionData);

      if (editingSection?.id) {
        const { data, error } = await supabase
          .from('home_sections')
          .update(sectionData)
          .eq('id', editingSection.id)
          .select('*, categories(name)');

        if (error) {
          console.error('Güncelleme hatası:', error);
          throw error;
        }
        console.log('Güncelleme yanıtı:', data);
      } else {
        const { data, error } = await supabase
          .from('home_sections')
          .insert([sectionData])
          .select('*, categories(name)');

        if (error) {
          console.error('Ekleme hatası:', error);
          throw error;
        }
        console.log('Ekleme yanıtı:', data);
      }

      await fetchSections();
      setIsFormOpen(false);
      setEditingSection(null);
      setFormData({
        id: '',
        title: '',
        subtitle: '',
        image: '',
        category: '',
        buttonText: 'KEŞFET',
        targetSubcategory: ''
      });
    } catch (error) {
      console.error('Tam hata:', error);
      handleError(error, 'Section kaydedilirken bir hata oluştu!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu section\'ı silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('home_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchSections();
    } catch (error) {
      handleError(error, 'Section silinirken bir hata oluştu!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Anasayfa Görselleri</h2>
        <button
          onClick={() => {
            setEditingSection(null);
            setFormData({
              id: '',
              title: '',
              subtitle: '',
              image: '',
              category: '',
              buttonText: 'KEŞFET',
              targetSubcategory: ''
            });
            setIsFormOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Yeni Section Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div key={section.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="relative aspect-video bg-gray-100">
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Görsel yükleme hatası:', e);
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Görsel+Yüklenemedi';
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{section.title}</h3>
              {section.subtitle && (
                <p className="text-gray-600 mt-1">{section.subtitle}</p>
              )}
              {section.category && section.targetSubcategory && (
                <p className="text-sm text-gray-500 mt-2">
                  Hedef: {section.category} / {section.targetSubcategory}
                </p>
              )}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setEditingSection(section);
                    setFormData(section);
                    setIsFormOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => section.id && handleDelete(section.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">
                {editingSection ? 'Section Düzenle' : 'Yeni Section Ekle'}
              </h3>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingSection(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Başlık</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Alt Başlık</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Görsel URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-xxx"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                {formData.image && (
                  <div className="mt-2 relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={formData.image}
                      alt="Önizleme"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Görsel yükleme hatası:', e);
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Görsel+Yüklenemedi';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({ 
                      ...formData, 
                      category: e.target.value,
                      targetSubcategory: '' 
                    });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map(category => (
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
                    value={formData.targetSubcategory}
                    onChange={(e) => setFormData({ ...formData, targetSubcategory: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Alt Kategori Seçin</option>
                    {categories
                      .find(cat => cat.name === formData.category)
                      ?.subcategories.map(sub => (
                        <option key={sub} value={sub}>
                          {sub.charAt(0).toUpperCase() + sub.slice(1)}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingSection(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  {editingSection ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};