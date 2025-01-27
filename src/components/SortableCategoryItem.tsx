import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2 } from 'lucide-react';
import { Category } from '../types/product';

interface SortableCategoryItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (categoryName: string) => void;
}

export const SortableCategoryItem: React.FC<SortableCategoryItemProps> = ({
  category,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 bg-white"
    >
      <div className="flex items-start gap-4">
        <button
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded mt-1"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={20} className="text-gray-400" />
        </button>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">
            {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {category.subcategories.map((sub) => (
              <span
                key={sub}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(category)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit2 size={20} />
          </button>
          <button
            onClick={() => onDelete(category.name)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};