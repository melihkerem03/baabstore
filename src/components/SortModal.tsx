import React from 'react';

interface SortModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSort: (type: string) => void;
  anchorEl?: HTMLElement | null;
}

export const SortModal: React.FC<SortModalProps> = ({ isOpen, onClose, onSort, anchorEl }) => {
  if (!isOpen || !anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();

  const sortOptions = [
    { id: 'price-asc', label: 'Artan Fiyat' },
    { id: 'price-desc', label: 'Azalan Fiyat' },
    { id: 'discount', label: 'İndirimli Ürünler' },
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown Menu */}
      <div 
        className="fixed bg-white z-50 w-48 shadow-lg border border-gray-200"
        style={{
          top: rect.bottom + 4,
          right: window.innerWidth - rect.right,
        }}
      >
        <div className="py-1">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm"
              onClick={() => {
                onSort(option.id);
                onClose();
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}; 