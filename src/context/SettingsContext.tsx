import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/supabase';

interface Settings {
  theme?: 'light' | 'dark';
  language?: string;
}

const defaultSettings: Settings = {
  theme: 'light',
  language: 'tr'
};

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('settings');
    return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (fetchError) throw fetchError;
      setSettings(data);
      setError(null);
    } catch (err) {
      console.error('Logo ayarları yüklenirken hata:', err);
      setError('Logo ayarları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  // İlk yükleme
  useEffect(() => {
    fetchSettings();
  }, []);

  // Real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel('settings_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'settings' 
        }, 
        () => {
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SettingsContext.Provider value={{
      settings,
      loading,
      error,
      refreshSettings: fetchSettings,
      updateSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};