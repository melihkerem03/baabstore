import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { convertImageToBase64, validateImage } from '../utils/imageUpload';

interface ImageUploadProps {
  onImageSelect: (base64Image: string) => void;
  currentImage?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateImage(file)) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      const base64Image = await convertImageToBase64(file);
      onImageSelect(base64Image);
    } catch (error) {
      console.error('Resim yükleme hatası:', error);
      alert('Resim yüklenirken bir hata oluştu.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {currentImage ? (
              <img
                src={currentImage}
                alt="Ürün resmi"
                className="w-32 h-32 object-cover mb-4 rounded-lg"
              />
            ) : (
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
            )}
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Resim yüklemek için tıklayın</span>
            </p>
            <p className="text-xs text-gray-500">Sadece JPG (max. 5MB)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".jpg,.jpeg"
            onChange={handleImageChange}
          />
        </label>
      </div>
    </div>
  );
};