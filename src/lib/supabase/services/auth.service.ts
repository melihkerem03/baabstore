import { supabase } from '../config';
import { User } from '../../../types/auth';

export const authService = {
  async signUp(email: string, password: string, name: string) {
    const { data: auth, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (signUpError) throw signUpError;

    if (auth.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: auth.user.id,
            email,
            name,
            is_admin: false,
          },
        ]);

      if (profileError) throw profileError;
    }

    return auth;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;

    return userData as User;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user) return null;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) throw userError;

    return userData as User;
  },
};