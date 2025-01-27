import { useEffect, useState } from 'react';
import { imageStorageService } from '../../lib/storage/imageStorage.service';
import { ImageGallery } from './ImageGallery';

// Inside ProductDetail component, add:
const [productImages, setProductImages] = useState<{
  mainImage: string;
  additionalImages: string[];
} | null>(null);

useEffect(() => {
  const images = imageStorageService.getProductImages(product.id);
  setProductImages(images);
}, [product.id]);

// Update the JSX to use ImageGallery:
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <ImageGallery 
    mainImage={productImages?.mainImage || product.image}
    additionalImages={productImages?.additionalImages || []}
  />
  {/* Rest of the product details */}
</div>