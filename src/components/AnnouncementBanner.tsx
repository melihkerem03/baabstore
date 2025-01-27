import React, { useEffect, useRef, useState } from 'react';
import { useAnnouncements } from '../context/AnnouncementContext';

export const AnnouncementBanner: React.FC = () => {
  const { activeAnnouncement } = useAnnouncements();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!activeAnnouncement || !containerRef.current || !textRef.current) return;

    const text = textRef.current;
    const speed = activeAnnouncement.scroll_speed || 100;
    
    const distance = text.offsetWidth;
    const duration = (distance / speed) * 1000;

    text.style.animation = `none`;
    text.offsetHeight;
    text.style.animation = isHovered 
      ? 'none' 
      : `marquee ${duration}ms linear infinite`;

  }, [activeAnnouncement, isHovered]);

  if (!activeAnnouncement?.is_active) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div 
        className="bg-black/50 backdrop-blur-sm text-white h-12 overflow-hidden"
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full h-full flex items-center">
          <div
            ref={textRef}
            className="absolute whitespace-nowrap animate-marquee px-4 h-6 flex items-center"
            style={{
              animation: 'none',
            }}
          >
            {activeAnnouncement.text}
          </div>
        </div>
      </div>
    </div>
  );
};