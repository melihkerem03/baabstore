const MAX_CHUNK_SIZE = 64 * 1024; // 64KB per chunk
const MAX_TOTAL_SIZE = 4.5 * 1024 * 1024; // 4.5MB total limit

export class StorageService {
  private static instance: StorageService;
  
  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  private getTotalSize(): number {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        total += (localStorage.getItem(key) || '').length;
      }
    }
    return total;
  }

  private cleanup(): void {
    // Remove temporary and old items
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.includes('_temp_') || key.includes('_old_')) {
        localStorage.removeItem(key);
      }
    }
  }

  public setItem(key: string, value: any): void {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage is not available');
      return;
    }

    try {
      const serialized = JSON.stringify(value);
      
      // Check total size before storing
      if (this.getTotalSize() + serialized.length > MAX_TOTAL_SIZE) {
        this.cleanup();
        // If still too large after cleanup, throw error
        if (this.getTotalSize() + serialized.length > MAX_TOTAL_SIZE) {
          throw new Error('Storage quota would be exceeded');
        }
      }

      // Store directly if small enough
      if (serialized.length < MAX_CHUNK_SIZE) {
        localStorage.setItem(key, serialized);
        return;
      }

      // Store in chunks if large
      const chunks = this.chunk(serialized);
      
      // Store chunks with temporary keys
      chunks.forEach((chunkData, index) => {
        localStorage.setItem(`${key}_temp_${index}`, chunkData);
      });

      // Remove old data
      this.clearItem(key);

      // Rename temporary chunks to final keys
      chunks.forEach((_, index) => {
        const tempKey = `${key}_temp_${index}`;
        const finalKey = `${key}_${index}`;
        const chunkData = localStorage.getItem(tempKey);
        if (chunkData) {
          localStorage.setItem(finalKey, chunkData);
          localStorage.removeItem(tempKey);
        }
      });

      localStorage.setItem(`${key}_chunks`, chunks.length.toString());
    } catch (error) {
      console.warn(`Failed to store data for key "${key}":`, error);
      // Clean up any partial data
      this.clearItem(key);
    }
  }

  public getItem<T>(key: string): T | null {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage is not available');
      return null;
    }

    try {
      // Check if data is chunked
      const chunksCount = localStorage.getItem(`${key}_chunks`);
      if (!chunksCount) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      }

      // Reconstruct chunked data
      let serialized = '';
      for (let i = 0; i < parseInt(chunksCount); i++) {
        const chunk = localStorage.getItem(`${key}_${i}`);
        if (!chunk) {
          throw new Error(`Chunk ${i} missing for key "${key}"`);
        }
        serialized += chunk;
      }
      return JSON.parse(serialized);
    } catch (error) {
      console.warn(`Failed to retrieve data for key "${key}":`, error);
      return null;
    }
  }

  public clearItem(key: string): void {
    if (!this.isStorageAvailable()) return;

    // Clear main item
    localStorage.removeItem(key);
    
    // Clear all related chunks
    const keys = Object.keys(localStorage);
    keys.forEach(k => {
      if (k.startsWith(`${key}_`)) {
        localStorage.removeItem(k);
      }
    });
  }

  private chunk(str: string): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < str.length; i += MAX_CHUNK_SIZE) {
      chunks.push(str.slice(i, i + MAX_CHUNK_SIZE));
    }
    return chunks;
  }
}

export const storageService = StorageService.getInstance();