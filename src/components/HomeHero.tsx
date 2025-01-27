import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHomeSections } from '../context/HomeSectionContext';
import type { HomeSection } from '../types/homeSection';

export const HomeHero = () => {
  const { sections, loading, error } = useHomeSections();
  const navigate = useNavigate();

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.id} className="relative">
          <div className="relative h-[400px] md:h-[500px] overflow-hidden">
            <img
              src={section.image}
              alt={section.title}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = '/placeholder.jpg';
              }}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {section.title}
              </h2>
              {section.subtitle && (
                <p className="text-lg md:text-xl text-white mb-6">
                  {section.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 