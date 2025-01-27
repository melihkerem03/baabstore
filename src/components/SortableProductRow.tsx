import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { Product } from '../types/product';

interface SortableProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const SortableProductRow: React.FC<SortableProductRowProps> = ({
  product,
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
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-gray-50">
      <td className="px-2">
        <button
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={20} className="text-gray-400" />
        </button>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={product.image}
            alt={product.name}
          />
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-500">{product.description}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {product.subcategory.charAt(0).toUpperCase() + product.subcategory.slice(1)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {product.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{product.stock}</td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="text-blue-600 hover:text-blue-900"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </td>
    </tr>
  );
};