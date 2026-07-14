import { create } from 'zustand';
import { supabase } from '../lib/supabase';

type UserRole = 'guru' | 'siswa' | null;

interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },
  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      // Fetch profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (profile) {
        set({
          user: {
            id: profile.id,
            name: profile.nama,
            role: profile.role,
          },
          isAuthenticated: true,
        });
      } else {
        // Fallback if profile not created yet
        set({
          user: {
            id: session.user.id,
            name: session.user.email || 'User',
            role: 'siswa', // Default fallback
          },
          isAuthenticated: true,
        });
      }
    }
  },
}));
