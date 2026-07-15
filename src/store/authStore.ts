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
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  updateUser: (data) => set((state) => ({
    user: state.user ? { ...state.user, ...data } : null,
  })),
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },
  initialize: async () => {
    // 1. Dapatkan session saat ini
    const { data: { session } } = await supabase.auth.getSession();
    
    const handleSession = async (currentSession: any) => {
      if (currentSession?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();
          
        if (profile) {
          set({
            user: { id: profile.id, name: profile.nama, role: profile.role },
            isAuthenticated: true,
            isInitialized: true,
          });
        } else {
          set({
            user: { id: currentSession.user.id, name: currentSession.user.email || 'User', role: 'siswa' },
            isAuthenticated: true,
            isInitialized: true,
          });
        }
      } else {
        set({ user: null, isAuthenticated: false, isInitialized: true });
      }
    };

    await handleSession(session);

    // 2. Dengarkan perubahan state auth (login, logout, token refresh)
    supabase.auth.onAuthStateChange(async (_event, newSession) => {
      await handleSession(newSession);
    });
  },
}));
