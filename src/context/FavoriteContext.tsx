import React, { createContext, useContext, useState, useEffect } from 'react';
import { favoriteService, Favorite } from '../services/favorite.service';
import { useAuth } from './AuthContext';

interface FavoriteContextType {
  favorites: Favorite[];
  isLoading: boolean;
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Kullanıcının favorilerini yükle
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userFavorites = await favoriteService.getUserFavorites(user.id);
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToFavorites = async (productId: string) => {
    if (!user) throw new Error('Favorilere eklemek için giriş yapmalısınız');

    try {
      await favoriteService.addToFavorites(user.id, productId);
      await loadFavorites(); // Favorileri yeniden yükle
    } catch (error) {
      console.error('Favorilere eklenirken hata:', error);
      throw error;
    }
  };

  const removeFromFavorites = async (productId: string) => {
    if (!user) return;

    try {
      await favoriteService.removeFromFavorites(user.id, productId);
      await loadFavorites(); // Favorileri yeniden yükle
    } catch (error) {
      console.error('Favorilerden kaldırılırken hata:', error);
      throw error;
    }
  };

  const isFavorite = (productId: string): boolean => {
    return favorites.some(fav => fav.product_id === productId);
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        isLoading,
        addToFavorites,
        removeFromFavorites,
        isFavorite
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
}; 