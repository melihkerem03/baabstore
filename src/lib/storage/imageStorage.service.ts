import { storageService } from './storage.service';

const IMAGE_STORAGE_KEY = 'product_images';

interface ImageStorage {
  [productId: string]: {
    mainImage: string;
    additionalImages: string[];
  }
}

export const imageStorageService = {
  getStorage(): ImageStorage {
    return storageService.getItem<ImageStorage>(IMAGE_STORAGE_KEY) || {};
  },

  saveStorage(storage: ImageStorage): void {
    storageService.setItem(IMAGE_STORAGE_KEY, storage);
  },

  saveProductImages(productId: string, mainImage: string, additionalImages: string[] = []): void {
    const storage = this.getStorage();
    storage[productId] = {
      mainImage,
      additionalImages: additionalImages.filter(img => img !== mainImage)
    };
    this.saveStorage(storage);
  },

  getProductImages(productId: string): { mainImage: string; additionalImages: string[] } | null {
    const storage = this.getStorage();
    return storage[productId] || null;
  },

  deleteProductImages(productId: string): void {
    const storage = this.getStorage();
    delete storage[productId];
    this.saveStorage(storage);
  }
};