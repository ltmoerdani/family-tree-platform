import { create } from 'zustand';
import { FamilyMember, FamilyStats, ViewMode, TreePosition } from '../types/family';

interface FamilyStore {
  members: FamilyMember[];
  selectedMember: FamilyMember | null;
  searchQuery: string;
  viewMode: ViewMode;
  treePosition: TreePosition;
  stats: FamilyStats;
  editMode: boolean;
  hasUnsavedChanges: boolean;
  
  // Actions
  setMembers: (members: FamilyMember[]) => void;
  setSelectedMember: (member: FamilyMember | null) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: Partial<ViewMode>) => void;
  setTreePosition: (position: Partial<TreePosition>) => void;
  setEditMode: (enabled: boolean) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  updateStats: () => void;
  addMember: (member: FamilyMember) => void;
  updateMember: (id: string, updates: Partial<FamilyMember>) => void;
  deleteMember: (id: string) => void;
}

export const useFamilyStore = create<FamilyStore>((set, get) => ({
  members: [],
  selectedMember: null,
  searchQuery: '',
  viewMode: {
    type: 'tree',
    zoom: 75,
    showDeceased: true,
    showAlive: true,
    selectedGeneration: null,
  },
  treePosition: {
    x: 0,
    y: 0,
    scale: 1,
  },
  editMode: false,
  hasUnsavedChanges: false,
  stats: {
    totalMembers: 0,
    totalGenerations: 0,
    maleCount: 0,
    femaleCount: 0,
    ageDistribution: {
      '0-18': 0,
      '19-35': 0,
      '36-60': 0,
      '60+': 0,
    },
    locationDistribution: {},
  },

  setMembers: (members) => {
    set({ members });
    get().updateStats();
  },

  setSelectedMember: (member) => set({ selectedMember: member }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setViewMode: (mode) => set((state) => ({
    viewMode: { ...state.viewMode, ...mode }
  })),

  setTreePosition: (position) => set((state) => ({
    treePosition: { ...state.treePosition, ...position }
  })),

  setEditMode: (enabled) => set({ editMode: enabled }),

  setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),

  updateStats: () => {
    const { members } = get();
    const currentYear = new Date().getFullYear();
    
    const stats: FamilyStats = {
      totalMembers: members.length,
      totalGenerations: Math.max(...members.map(m => m.generation), 0),
      maleCount: members.filter(m => m.gender === 'male').length,
      femaleCount: members.filter(m => m.gender === 'female').length,
      ageDistribution: {
        '0-18': 0,
        '19-35': 0,
        '36-60': 0,
        '60+': 0,
      },
      locationDistribution: {},
    };

    members.forEach(member => {
      // Helper function to calculate age
      const calculateAge = (member: FamilyMember) => {
        const birthYear = new Date(member.birthDate).getFullYear();
        if (member.isAlive) {
          return currentYear - birthYear;
        }
        return member.deathDate ? new Date(member.deathDate).getFullYear() - birthYear : 0;
      };

      // Calculate age distribution
      const age = calculateAge(member);
      
      if (age <= 18) stats.ageDistribution['0-18']++;
      else if (age <= 35) stats.ageDistribution['19-35']++;
      else if (age <= 60) stats.ageDistribution['36-60']++;
      else stats.ageDistribution['60+']++;

      // Calculate location distribution
      if (member.currentLocation) {
        stats.locationDistribution[member.currentLocation] = 
          (stats.locationDistribution[member.currentLocation] || 0) + 1;
      }
    });

    set({ stats });
  },

  addMember: (member) => {
    const members = [...get().members, member];
    set({ members, hasUnsavedChanges: true });
    get().updateStats();
  },

  updateMember: (id, updates) => {
    const members = get().members.map(m => 
      m.id === id ? { ...m, ...updates } : m
    );
    set({ members, hasUnsavedChanges: true });
    get().updateStats();
  },

  deleteMember: (id) => {
    const members = get().members.filter(m => m.id !== id);
    set({ members, hasUnsavedChanges: true });
    get().updateStats();
  },
}));