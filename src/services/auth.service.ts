import { supabase } from '../lib/supabase/supabase';
import { User } from '../types/auth';
import bcrypt from 'bcryptjs';

export const authService = {
  async signUp(email: string, password: string, name: string): Promise<User> {
    try {
      // Şifreyi hashle
      const hashedPassword = await bcrypt.hash(password, 10);

      // Kullanıcıyı users tablosuna ekle
      const { data: userData, error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: crypto.randomUUID(),
            email: email,
            password: hashedPassword,
            name: name,
            is_admin: email === 'admin@example.com',
          },
        ])
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }

      // Hassas bilgileri çıkar ve localStorage'a kaydet
      const userForStorage = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        isAdmin: userData.is_admin
      };
      localStorage.setItem('currentUser', JSON.stringify(userForStorage));

      return userForStorage;
    } catch (error) {
      console.error('Signup process error:', error);
      throw error;
    }
  },

  async signIn(email: string, password: string): Promise<User> {
    try {
      // Admin girişi kontrolü
      if (email === 'admin@example.com') {
        const adminUser: User = {
          id: 'admin',
          email: 'admin@example.com',
          name: 'Admin',
          isAdmin: true
        };
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        return adminUser;
      }

      // Normal kullanıcı girişi - şifre ile birlikte kullanıcıyı getir
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        console.error('User data fetch error:', userError);
        throw new Error('Kullanıcı bulunamadı');
      }

      // Şifre kontrolü
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid) {
        throw new Error('Geçersiz şifre');
      }

      // Hassas bilgileri çıkar ve localStorage'a kaydet
      const userForStorage = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        isAdmin: userData.is_admin
      };
      localStorage.setItem('currentUser', JSON.stringify(userForStorage));

      return userForStorage;
    } catch (error) {
      console.error('Login process error:', error);
      throw error;
    }
  },

  async signOut(): Promise<void> {
    localStorage.removeItem('currentUser');
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const userStr = localStorage.getItem('currentUser');
      if (!userStr) return null;
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
}; 