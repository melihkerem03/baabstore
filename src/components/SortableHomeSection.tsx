import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2 } from 'lucide-react';
import { HomeSection } from '../types/homepage';

interface SortableHomeSectionProps {
  section: HomeSection;
  onEdit: (section: HomeSection) => void;
  onDelete: (id: string) => void;
}

export const SortableHomeSection: React.FC<SortableHomeSectionProps> = ({
  section,
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
  } = useSortable({ id: section.id });

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

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <img
              src={section.image}
              alt={section.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
            <p className="text-gray-600">{section.subtitle}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium">Hedef:</span>
              <span>
                {section.category.charAt(0).toUpperCase() + section.category.slice(1)} /
                {section.targetSubcategory.charAt(0).toUpperCase() + section.targetSubcategory.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium">Buton:</span>
              <span>{section.buttonText}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(section)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit2 size={20} />
          </button>
          <button
            onClick={() => onDelete(section.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};