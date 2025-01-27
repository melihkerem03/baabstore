import React, { createContext, useContext, useState, useEffect } from 'react';
import { Announcement } from '../types/announcement';
import { announcementService } from '../lib/supabase/services/announcement.service';

interface AnnouncementContextType {
  announcements: Announcement[];
  activeAnnouncement: Announcement | null;
  createAnnouncement: (text: string) => Promise<void>;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export const AnnouncementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);

  const fetchAnnouncements = async () => {
    try {
      const data = await announcementService.getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Duyurular yüklenirken hata:', error);
    }
  };

  const fetchActiveAnnouncement = async () => {
    try {
      const data = await announcementService.getActiveAnnouncement();
      setActiveAnnouncement(data);
    } catch (error) {
      console.error('Aktif duyuru yüklenirken hata:', error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchActiveAnnouncement();
  }, []);

  const createAnnouncement = async (text: string) => {
    try {
      await announcementService.createAnnouncement(text);
      await fetchAnnouncements();
      await fetchActiveAnnouncement();
    } catch (error) {
      console.error('Duyuru oluşturulurken hata:', error);
      throw error;
    }
  };

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    try {
      await announcementService.updateAnnouncement(id, updates);
      await fetchAnnouncements();
      await fetchActiveAnnouncement();
    } catch (error) {
      console.error('Duyuru güncellenirken hata:', error);
      throw error;
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      await announcementService.deleteAnnouncement(id);
      await fetchAnnouncements();
      await fetchActiveAnnouncement();
    } catch (error) {
      console.error('Duyuru silinirken hata:', error);
      throw error;
    }
  };

  return (
    <AnnouncementContext.Provider value={{
      announcements,
      activeAnnouncement,
      createAnnouncement,
      updateAnnouncement,
      deleteAnnouncement
    }}>
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (context === undefined) {
    throw new Error('useAnnouncements must be used within an AnnouncementProvider');
  }
  return context;
};