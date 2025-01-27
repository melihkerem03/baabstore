import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useCategories } from '../context/CategoryContext';
import { CategoryTitle } from '../types/product';

export const CategoryTitleManager = () => {
  const { categories, categoryTitles, updateCategoryTitles } = useCategories();
  const [titles, setTitles] = useState<CategoryTitle[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Kategoriler değiştiğinde başlıkları güncelle
    const initialTitles = categories.map(category => {
      const existingTitle = categoryTitles.find(t => t.categoryName === category.name);
      return existingTitle || {
        categoryName: category.name,
        title: category.name.charAt(0).toUpperCase() + category.name.slice(1),
        subtitle: ''
      };
    });
    setTitles(initialTitles);
  }, [categories, categoryTitles]);

  const handleTitleChange = (categoryName: string, field: keyof CategoryTitle, value: string) => {
    setTitles(prev => prev.map(title => 
      title.categoryName === categoryName ? { ...title, [field]: value } : title
    ));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await updateCategoryTitles(titles);
      setHasChanges(false);
      alert('Başlıklar başarıyla kaydedildi!');
    } catch (error) {
      console.error('Başlıklar kaydedilirken hata oluştu:', error);
      alert('Başlıklar kaydedilirken bir hata oluştu!');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Kategori Başlıkları</h2>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Save size={20} />
            Değişiklikleri Kaydet
          </button>
        )}
      </div>

      <div className="space-y-6">
        {titles.map((title) => (
          <div key={title.categoryName} className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-4">
              {title.categoryName.charAt(0).toUpperCase() + title.categoryName.slice(1)}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Başlık</label>
                <input
                  type="text"
                  value={title.title}
                  onChange={(e) => handleTitleChange(title.categoryName, 'title', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Kategori başlığı"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Alt Başlık</label>
                <input
                  type="text"
                  value={title.subtitle}
                  onChange={(e) => handleTitleChange(title.categoryName, 'subtitle', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Kategori alt başlığı"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};