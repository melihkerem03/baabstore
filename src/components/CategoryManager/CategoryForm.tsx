import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Category } from '../../types/product';

interface CategoryFormProps {
  onSubmit: (category: Category) => void;
  onClose: () => void;
  initialCategory?: Category;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  onSubmit,
  onClose,
  initialCategory
}) => {
  const [formData, setFormData] = useState<Category>(initialCategory || {
    name: '',
    subcategories: []
  });
  const [newSubcategory, setNewSubcategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  const handleAddSubcategory = () => {
    if (!newSubcategory.trim()) return;
    setFormData(prev => ({
      ...prev,
      subcategories: [...prev.subcategories, newSubcategory.trim()]
    }));
    setNewSubcategory('');
  };

  const handleRemoveSubcategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {initialCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Kategori Adı</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Alt Kategoriler</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.subcategories.map((sub, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {sub}
                  <button
                    type="button"
                    onClick={() => handleRemoveSubcategory(index)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Yeni alt kategori"
              />
              <button
                type="button"
                onClick={handleAddSubcategory}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Ekle
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {initialCategory ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};