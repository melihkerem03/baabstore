import { supabase } from '../config';
import { HomeSection } from '../../../types/homepage';

export const homeSectionService = {
  async getHomeSections() {
    const { data, error } = await supabase
      .from('home_sections')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as HomeSection[];
  },

  async updateHomeSection(id: string, section: Partial<HomeSection>) {
    const { data, error } = await supabase
      .from('home_sections')
      .update(section)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as HomeSection;
  },
};