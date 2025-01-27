import { supabase } from '../config';
import { Announcement } from '../../../types/announcement';

export const announcementService = {
  async getAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Announcement[];
  },

  async getActiveAnnouncement() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as Announcement | null;
  },

  async createAnnouncement(text: string, scrollSpeed: number = 100) {
    const { data, error } = await supabase
      .from('announcements')
      .insert([{ 
        text,
        scroll_speed: scrollSpeed,
        is_active: true 
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }
    return data as Announcement;
  },

  async updateAnnouncement(id: string, updates: Partial<Announcement>) {
    const { data, error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Announcement;
  },

  async deleteAnnouncement(id: string) {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};