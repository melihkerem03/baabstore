import { v4 as uuidv4 } from 'uuid';

export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const validateImage = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    alert('Sadece JPG formatında dosyalar yüklenebilir!');
    return false;
  }

  if (file.size > maxSize) {
    alert('Dosya boyutu 5MB\'dan küçük olmalıdır!');
    return false;
  }

  return true;
};

export const generateImageFileName = (file: File): string => {
  const extension = file.name.split('.').pop();
  return `${uuidv4()}.${extension}`;
};