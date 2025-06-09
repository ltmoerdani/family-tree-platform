import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  familyName?: string;
  avatar?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  clearError: () => void;
  updateUser: (updates: Partial<User>) => void;
}

// Mock user database
const mockUsers: Record<string, { password: string; user: User }> = {
  'demo@familytree.com': {
    password: 'demo123',
    user: {
      id: '1',
      email: 'demo@familytree.com',
      name: 'Demo User',
      familyName: 'Wijaya',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
      createdAt: '2024-01-01T00:00:00Z'
    }
  }
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await delay(1000);
          
          const userRecord = mockUsers[email.toLowerCase()];
          
          if (!userRecord || userRecord.password !== password) {
            throw new Error('Email atau password salah');
          }

          set({
            user: userRecord.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login gagal'
          });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await delay(1000);
          
          // Check if user already exists
          if (mockUsers[email.toLowerCase()]) {
            throw new Error('Email sudah terdaftar');
          }

          // Create new user
          const newUser: User = {
            id: Date.now().toString(),
            email: email.toLowerCase(),
            name,
            createdAt: new Date().toISOString()
          };

          // Add to mock database
          mockUsers[email.toLowerCase()] = {
            password,
            user: newUser
          };

          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registrasi gagal'
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null
        });
      },

      clearError: () => {
        set({ error: null });
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...updates }
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);