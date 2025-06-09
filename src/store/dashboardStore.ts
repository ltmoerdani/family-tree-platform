import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FamilyTree {
  id: string;
  name: string;
  memberCount: number;
  generationCount: number;
  lastUpdated: string;
  createdAt: string;
  thumbnail?: string;
}

interface DashboardState {
  familyTrees: FamilyTree[];
  viewMode: 'card' | 'list';
  isPremium: boolean;
  
  // Actions
  setViewMode: (mode: 'card' | 'list') => void;
  createFamilyTree: (name: string) => FamilyTree;
  updateFamilyTree: (id: string, updates: Partial<FamilyTree>) => void;
  deleteFamilyTree: (id: string) => void;
  setPremium: (premium: boolean) => void;
}

// Mock data for existing family trees
const mockFamilyTrees: FamilyTree[] = [
  {
    id: 'wijaya-family',
    name: 'Keluarga Besar Wijaya',
    memberCount: 11,
    generationCount: 3,
    lastUpdated: '2024-01-15T10:30:00Z',
    createdAt: '2023-06-15T08:00:00Z'
  }
];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      familyTrees: mockFamilyTrees,
      viewMode: 'card',
      isPremium: false,

      setViewMode: (mode) => set({ viewMode: mode }),

      createFamilyTree: (name) => {
        const newTree: FamilyTree = {
          id: `family-${Date.now()}`,
          name,
          memberCount: 0,
          generationCount: 0,
          lastUpdated: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };

        set(state => ({
          familyTrees: [...state.familyTrees, newTree]
        }));

        return newTree;
      },

      updateFamilyTree: (id, updates) => {
        set(state => ({
          familyTrees: state.familyTrees.map(tree =>
            tree.id === id 
              ? { ...tree, ...updates, lastUpdated: new Date().toISOString() }
              : tree
          )
        }));
      },

      deleteFamilyTree: (id) => {
        set(state => ({
          familyTrees: state.familyTrees.filter(tree => tree.id !== id)
        }));
      },

      setPremium: (premium) => set({ isPremium: premium })
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({
        familyTrees: state.familyTrees,
        viewMode: state.viewMode,
        isPremium: state.isPremium
      })
    }
  )
);