import React, { useState, useEffect } from 'react';

interface FilterState {
  minPrice: number | null;
  maxPrice: number | null;
  onlyDiscounted: boolean;
  onlyInStock: boolean;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
  onFilter: (filters: FilterState) => void;
  currentFilters: FilterState;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({ 
  isOpen, 
  onClose, 
  anchorEl,
  onFilter,
  currentFilters 
}) => {
  if (!isOpen || !anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();

  const [filters, setFilters] = useState<FilterState>(currentFilters);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleInputChange = (field: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onFilter(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      minPrice: null,
      maxPrice: null,
      onlyDiscounted: false,
      onlyInStock: false
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown Menu */}
      <div 
        className="fixed bg-white z-50 w-[280px] shadow-lg border border-gray-200"
        style={{
          top: rect.bottom + 4,
          left: rect.left,
        }}
      >
        <div className="p-4">
          {/* Fiyat Aralığı */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Fiyat Aralığı</h3>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleInputChange('minPrice', e.target.value ? Number(e.target.value) : null)}
                  className="w-full border rounded px-2 py-1.5 text-sm"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₺</span>
              </div>
              <span className="text-gray-400">-</span>
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleInputChange('maxPrice', e.target.value ? Number(e.target.value) : null)}
                  className="w-full border rounded px-2 py-1.5 text-sm"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₺</span>
              </div>
            </div>
          </div>

          {/* İndirim Durumu */}
          <div className="mb-3">
            <label className="flex items-center gap-2 text-sm">
              <input 
                type="checkbox" 
                checked={filters.onlyDiscounted}
                onChange={(e) => handleInputChange('onlyDiscounted', e.target.checked)}
                className="rounded" 
              />
              <span>Sadece İndirimli Ürünler</span>
            </label>
          </div>

          {/* Stok Durumu */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm">
              <input 
                type="checkbox" 
                checked={filters.onlyInStock}
                onChange={(e) => handleInputChange('onlyInStock', e.target.checked)}
                className="rounded" 
              />
              <span>Sadece Stokta Olanlar</span>
            </label>
          </div>

          {/* Filtre Butonları */}
          <div className="flex gap-2 pt-2 border-t">
            <button 
              className="flex-1 py-1.5 text-sm border border-black hover:bg-black hover:text-white transition-colors"
              onClick={handleReset}
            >
              Sıfırla
            </button>
            <button 
              className="flex-1 py-1.5 text-sm bg-black text-white hover:bg-gray-800 transition-colors"
              onClick={handleApply}
            >
              Uygula
            </button>
          </div>
        </div>
      </div>
    </>
  );
}; 