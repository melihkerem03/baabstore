import React, { useState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { useAnnouncements } from '../context/AnnouncementContext';
import { useAuth } from '../context/AuthContext';
import { Announcement } from '../types/announcement';

export const AnnouncementManager: React.FC = () => {
  const { announcements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncements();
  const { user } = useAuth();
  const [newText, setNewText] = useState('');
  const [scrollSpeed, setScrollSpeed] = useState(100); // Varsayılan hız

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.isAdmin) {
      alert('Bu işlemi yapabilmek için admin yetkisine sahip olmanız gerekiyor!');
      return;
    }

    if (!newText.trim()) return;

    try {
      await createAnnouncement(newText, scrollSpeed);
      setNewText('');
      alert('Duyuru başarıyla eklendi!');
    } catch (error) {
      console.error('Duyuru eklenirken hata:', error);
      let errorMessage = 'Beklenmeyen bir hata oluştu';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(`Duyuru eklenirken hata: ${errorMessage}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteAnnouncement(id);
      alert('Duyuru başarıyla silindi!');
    } catch (error) {
      console.error('Duyuru silinirken hata:', error);
      alert('Duyuru silinirken bir hata oluştu!');
    }
  };

  const handleToggleActive = async (announcement: Announcement) => {
    try {
      await updateAnnouncement(announcement.id, {
        is_active: !announcement.is_active
      });
      alert(announcement.is_active ? 'Duyuru deaktif edildi!' : 'Duyuru aktif edildi!');
    } catch (error) {
      console.error('Duyuru güncellenirken hata:', error);
      alert('Duyuru durumu güncellenirken bir hata oluştu!');
    }
  };

  const handleSpeedChange = async (id: string, newSpeed: number) => {
    try {
      await updateAnnouncement(id, { scroll_speed: newSpeed });
    } catch (error) {
      console.error('Duyuru hızı güncellenirken hata:', error);
      alert('Duyuru hızı güncellenirken bir hata oluştu!');
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Duyuru Yönetimi</h2>
        <p className="text-red-600">
          Bu sayfaya erişim yetkiniz bulunmamaktadır.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Duyuru Yönetimi</h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duyuru Metni
            </label>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Duyuru metnini girin..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kaydırma Hızı (px/saniye)
            </label>
            <input
              type="number"
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(Number(e.target.value))}
              min={10}
              max={500}
              step={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              10 (çok yavaş) - 500 (çok hızlı)
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <Save size={20} />
          Duyuru Ekle
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">Mevcut Duyurular</h3>
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="border rounded-lg p-4 flex items-start justify-between gap-4"
          >
            <div className="flex-1">
              <p className="text-gray-800">{announcement.text}</p>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Kaydırma Hızı
                </label>
                <input
                  type="range"
                  min={10}
                  max={500}
                  step={10}
                  value={announcement.scroll_speed || 100}
                  onChange={(e) => handleSpeedChange(announcement.id, Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">
                  {announcement.scroll_speed || 100} px/s
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleActive(announcement)}
                className={`px-3 py-1 rounded-md text-sm ${
                  announcement.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {announcement.is_active ? 'Aktif' : 'Pasif'}
              </button>
              <button
                onClick={() => handleDelete(announcement.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};