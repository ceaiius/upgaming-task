import { create } from 'zustand';
import { type User } from '../services/userService';

interface AppState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  user: User | null;
  setUser: (user: User) => void;
}

export const useStore = create<AppState>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  user: null,
  setUser: (user) => set({ user }),
}));
