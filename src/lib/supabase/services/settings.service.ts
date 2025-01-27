import { supabase } from '../config';
import { LogoSettings } from '../../../types/settings';

export const settingsService = {
  async getSettings() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (error) throw error;
    return data as LogoSettings;
  },

  async updateSettings(settings: LogoSettings) {
    const { error } = await supabase
      .from('settings')
      .upsert({
        id: 1, // Varsayılan ayarlar ID'si
        logo: settings.logo,
        homeLogoSize: settings.homeLogoSize,
        defaultLogoSize: settings.defaultLogoSize,
        homeLogoOffset: settings.homeLogoOffset,
        defaultLogoOffset: settings.defaultLogoOffset
      });

    if (error) throw error;
  }
}; 