import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  mainImage: string;
  additionalImages: string[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ mainImage, additionalImages }) => {
  const allImages = [mainImage, ...additionalImages];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToImage = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="aspect-square relative overflow-hidden bg-gray-100 rounded-lg">
        <img
          src={allImages[currentIndex]}
          alt="Product"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isTransitioning ? 'opacity-50' : 'opacity-100'
          }`}
        />
        
        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              disabled={isTransitioning}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white 
                       text-gray-800 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              disabled={isTransitioning}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white 
                       text-gray-800 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="mt-4 grid grid-cols-6 gap-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              disabled={isTransitioning}
              className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-all 
                         ${currentIndex === index ? 'border-black' : 'border-transparent hover:border-gray-300'}
                         ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  isTransitioning ? 'opacity-50' : 'opacity-100'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};