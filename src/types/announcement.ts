export interface Announcement {
  id: string;
  text: string;
  is_active: boolean;
  scroll_speed?: number; // piksel/saniye
  created_at?: string;
  updated_at?: string;
}

export interface AnnouncementContextType {
  announcements: Announcement[];
  activeAnnouncement: Announcement | null;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  setActiveAnnouncement: (id: string) => Promise<void>;
}