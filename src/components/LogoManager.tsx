import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const LogoManager: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [hasChanges, setHasChanges] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);

  const handleSave = async () => {
    try {
      await updateSettings(tempSettings);
      setHasChanges(false);
      alert('Logo ayarları başarıyla kaydedildi!');
    } catch (error) {
      console.error('Ayarlar kaydedilirken hata:', error);
      alert('Ayarlar kaydedilirken bir hata oluştu!');
    }
  };

  const handleLogoUrlChange = (value: string) => {
    setTempSettings(prev => ({ ...prev, logo: value }));
    setHasChanges(true);
  };

  const handleSizeChange = (type: 'home' | 'default', value: number) => {
    setTempSettings(prev => ({
      ...prev,
      [type === 'home' ? 'homelogosize' : 'defaultlogosize']: value
    }));
    setHasChanges(true);
  };

  const handleOffsetChange = (type: 'home' | 'default', value: number) => {
    setTempSettings(prev => ({
      ...prev,
      [type === 'home' ? 'homelogooffset' : 'defaultlogooffset']: value
    }));
    setHasChanges(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Logo Yönetimi</h2>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo URL
          </label>
          <input
            type="url"
            value={tempSettings.logo}
            onChange={(e) => handleLogoUrlChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Logo URL'sini girin"
          />
          {tempSettings.logo && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Önizleme:</p>
              <img
                src={tempSettings.logo}
                alt="Logo önizleme"
                className="max-h-20 object-contain"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = '/placeholder-logo.png';
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ana Sayfa Logo Boyutu (%)
          </label>
          <input
            type="number"
            value={tempSettings.homelogosize}
            onChange={(e) => handleSizeChange('home', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            min="50"
            max="200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Varsayılan Logo Boyutu (%)
          </label>
          <input
            type="number"
            value={tempSettings.defaultlogosize}
            onChange={(e) => handleSizeChange('default', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            min="50"
            max="200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ana Sayfa Logo Dikey Konumu (px)
          </label>
          <input
            type="number"
            value={tempSettings.homelogooffset}
            onChange={(e) => handleOffsetChange('home', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            min="-100"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Varsayılan Logo Dikey Konumu (px)
          </label>
          <input
            type="number"
            value={tempSettings.defaultlogooffset}
            onChange={(e) => handleOffsetChange('default', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            min="-100"
            max="100"
          />
        </div>
      </div>
    </div>
  );
};