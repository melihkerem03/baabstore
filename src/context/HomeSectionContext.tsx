import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/supabase';
import type { HomeSection } from '../types/homeSection';

interface HomeSectionContextType {
  sections: HomeSection[];
  loading: boolean;
  error: string | null;
  fetchSections: () => Promise<void>;
}

const HomeSectionContext = createContext<HomeSectionContextType | undefined>(undefined);

export const HomeSectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('home_sections')
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      
      const validSections = data?.map(section => ({
        id: section.id,
        title: section.title,
        subtitle: section.subtitle,
        image: section.image,
      })) || [];

      setSections(validSections);
    } catch (err) {
      console.error('Sections yüklenirken hata:', err);
      setError('Sections yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    const subscription = supabase
      .channel('home_sections_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'home_sections' 
        }, 
        () => {
          fetchSections();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <HomeSectionContext.Provider value={{
      sections,
      loading,
      error,
      fetchSections
    }}>
      {children}
    </HomeSectionContext.Provider>
  );
};

export const useHomeSections = () => {
  const context = useContext(HomeSectionContext);
  if (context === undefined) {
    throw new Error('useHomeSections must be used within a HomeSectionProvider');
  }
  return context;
};