import React, { useState } from 'react';
import { Plus, X, Edit2, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { FeaturedCategory } from '../types/featuredCategory';
import { useCategories } from '../context/CategoryContext';
import { useFeaturedCategories } from '../context/FeaturedCategoryContext';

interface FeaturedCategoryFormData {
  title: string;
  image: string;
  category: string;
  subcategory: string;
}

export const FeaturedCategoryManager: React.FC = () => {
  const { categories } = useCategories();
  const { 
    categories: featuredCategories, 
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories
  } = useFeaturedCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FeaturedCategory | null>(null);
  const [formData, setFormData] = useState<FeaturedCategoryFormData>({
    title: '',
    image: '',
    category: '',
    subcategory: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      // Update existing category
      await updateCategory(editingCategory.id, {
        ...formData,
        order: editingCategory.order
      });
    } else {
      // Add new category
      await addCategory({
        ...formData,
        order: featuredCategories.length + 1
      });
    }
    handleCloseForm();
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
    setFormData({
      title: '',
      image: '',
      category: '',
      subcategory: ''
    });
  };

  const handleEdit = (category: FeaturedCategory) => {
    setEditingCategory(category);
    setFormData({
      title: category.title,
      image: category.image,
      category: category.category,
      subcategory: category.subcategory
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteCategory(id);
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const index = featuredCategories.findIndex(cat => cat.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === featuredCategories.length - 1)
    ) {
      return;
    }

    const newCategories = [...featuredCategories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newCategories[index].order;
    newCategories[index].order = newCategories[targetIndex].order;
    newCategories[targetIndex].order = temp;
    
    await reorderCategories(newCategories.sort((a, b) => a.order - b.order));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Öne Çıkan Kategoriler</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Yeni Kategori Ekle
        </button>
      </div>

      {/* Category List */}
      <div className="space-y-4">
        {featuredCategories.map((category) => (
          <div 
            key={category.id}
            className="border rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <img
                src={category.image}
                alt={category.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-medium">{category.title}</h3>
                <p className="text-sm text-gray-600">
                  {category.category} / {category.subcategory}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleMove(category.id, 'up')}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <MoveUp size={20} />
              </button>
              <button
                onClick={() => handleMove(category.id, 'down')}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <MoveDown size={20} />
              </button>
              <button
                onClick={() => handleEdit(category)}
                className="p-2 text-blue-600 hover:text-blue-800"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">
                {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
              </h3>
              <button
                onClick={handleCloseForm}
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
                <label className="block text-sm font-medium text-gray-700">Görsel URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                {formData.image && (
                  <div className="mt-2 relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={formData.image}
                      alt="Önizleme"
                      className="w-full h-full object-cover"
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
                      subcategory: '' 
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
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
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
                  onClick={handleCloseForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  {editingCategory ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 