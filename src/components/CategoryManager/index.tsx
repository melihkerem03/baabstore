import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCategories } from '../../context/CategoryContext';
import { Category } from '../../types/product';
import { CategoryForm } from './CategoryForm';
import { CategoryList } from './CategoryList';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export const CategoryManager = () => {
  const { categories, addCategory, updateCategory, deleteCategory, reorderCategories } = useCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSubmit = async (formData: CategoryFormData) => {
    try {
      console.log('Form data:', formData);
      
      if (editingCategory) {
        console.log('Updating category:', editingCategory.name);
        await updateCategory({
          name: formData.name,
          subcategories: formData.subcategories || [],
          order_number: editingCategory.order_number
        });
      } else {
        console.log('Adding new category');
        await addCategory({
          name: formData.name,
          subcategories: formData.subcategories || [],
          order_number: categories.length
        });
      }
      
      setIsFormOpen(false);
      setEditingCategory(null);
      
      alert('Kategori başarıyla kaydedildi!');
    } catch (error) {
      console.error('Kategori kaydedilirken hata:', error);
      alert(`Kategori kaydedilirken bir hata oluştu: ${error.message}`);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (categoryName: string) => {
    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      deleteCategory(categoryName);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((cat) => cat.name === active.id);
      const newIndex = categories.findIndex((cat) => cat.name === over.id);
      
      const newOrder = [...categories];
      const [movedItem] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, movedItem);
      
      reorderCategories(newOrder);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Menü Yönetimi</h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsFormOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Yeni Kategori Ekle
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={categories.map(cat => cat.name)}
          strategy={verticalListSortingStrategy}
        >
          <CategoryList
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </SortableContext>
      </DndContext>

      {isFormOpen && (
        <CategoryForm
          onSubmit={handleSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setEditingCategory(null);
          }}
          initialCategory={editingCategory}
        />
      )}
    </div>
  );
};