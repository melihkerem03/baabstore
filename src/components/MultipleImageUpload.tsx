import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { convertImageToBase64, validateImage } from '../utils/imageUpload';

interface MultipleImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate total number of images
    if (images.length + files.length > maxImages) {
      alert(`En fazla ${maxImages} adet fotoğraf yükleyebilirsiniz.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate each file
    for (const file of files) {
      if (!validateImage(file)) {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
    }

    try {
      const base64Images = await Promise.all(
        files.map(file => convertImageToBase64(file))
      );
      onImagesChange([...images, ...base64Images]);
    } catch (error) {
      console.error('Resim yükleme hatası:', error);
      alert('Resimler yüklenirken bir hata oluştu.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Ürün fotoğrafı ${index + 1}`}
              className="w-full aspect-square object-cover rounded-lg"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Fotoğraf ekle</p>
              <p className="text-xs text-gray-400">({images.length}/{maxImages})</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".jpg,.jpeg"
              multiple
              onChange={handleImageChange}
            />
          </label>
        )}
      </div>
      <p className="text-sm text-gray-500">
        En fazla {maxImages} adet JPG formatında fotoğraf yükleyebilirsiniz.
      </p>
    </div>
  );
};