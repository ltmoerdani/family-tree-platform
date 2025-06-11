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
  currentFamilyTreeId: string | null;
  
  // Actions
  setMembers: (members: FamilyMember[]) => void;
  setSelectedMember: (member: FamilyMember | null) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: Partial<ViewMode>) => void;
  setTreePosition: (position: Partial<TreePosition>) => void;
  setEditMode: (enabled: boolean) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  setCurrentFamilyTreeId: (id: string | null) => void;
  updateStats: () => void;
  addMember: (member: FamilyMember) => void;
  updateMember: (id: string, updates: Partial<FamilyMember>) => void;
  deleteMember: (id: string) => void;
  addMemberWithRelationship: (member: FamilyMember, relationshipType: string, targetMemberId: string) => void;
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
  currentFamilyTreeId: null,
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

  setCurrentFamilyTreeId: (id: string | null) => set({ currentFamilyTreeId: id }),

  updateStats: () => {
    const { members } = get();
    const currentYear = new Date().getFullYear();
    
    const stats: FamilyStats = {
      totalMembers: members.length,
      totalGenerations: Math.max(...members.map((m: FamilyMember) => m.generation), 0),
      maleCount: members.filter((m: FamilyMember) => m.gender === 'male').length,
      femaleCount: members.filter((m: FamilyMember) => m.gender === 'female').length,
      ageDistribution: {
        '0-18': 0,
        '19-35': 0,
        '36-60': 0,
        '60+': 0,
      },
      locationDistribution: {},
    };

    members.forEach((member: FamilyMember) => {
      // Helper function to calculate age
      const calculateAge = (member: FamilyMember): number => {
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

  addMember: (newMember: FamilyMember) => {
    const member: FamilyMember = {
      ...newMember,
      id: newMember.id || `member-${Date.now()}`,
      generation: newMember.generation || 1,
      maritalStatus: newMember.maritalStatus || 'single',
      isAlive: newMember.isAlive ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    set((state) => ({
      members: [...state.members, member],
    }));
  },

  updateMember: (id: string, updates: Partial<FamilyMember>) => {
    const members = get().members.map((m: FamilyMember) => 
      m.id === id ? { ...m, ...updates } : m
    );
    set({ members, hasUnsavedChanges: true });
    get().updateStats();
  },

  deleteMember: (id: string) => {
    const members = get().members.filter((m: FamilyMember) => m.id !== id);
    set({ members, hasUnsavedChanges: true });
    get().updateStats();
  },

  addMemberWithRelationship: (member, relationshipType, targetMemberId) => {
    const { members } = get();
    const targetMember = members.find(m => m.id === targetMemberId);
    
    if (!targetMember) return;

    // Calculate generation based on relationship type
    let newGeneration = targetMember.generation;
    
    // Determine generation based on relationship type
    switch (relationshipType) {
      case 'father':
      case 'mother':
      case 'grandfather':
      case 'grandmother':
      case 'both_parents':
        newGeneration = targetMember.generation - 1;
        break;
      case 'biological_child':
      case 'step_child':
      case 'adopted_child':
        newGeneration = targetMember.generation + 1;
        break;
      case 'grandchild':
        newGeneration = targetMember.generation + 2;
        break;
      case 'great_grandchild':
        newGeneration = targetMember.generation + 3;
        break;
      case 'husband':
      case 'wife':
      case 'partner':
        // Same generation for spouses - no change needed
        break;
      default:
        // Keep same generation for unspecified relationships
        break;
    }

    // Create new member with calculated generation
    const newMember = {
      ...member,
      id: `member-${Date.now()}`,
      generation: newGeneration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update relationships
    const updatedMembers = [...members, newMember];
    
    // Update target member relationships if needed
    if (['biological_child', 'step_child', 'adopted_child'].includes(relationshipType)) {
      const targetIndex = updatedMembers.findIndex(m => m.id === targetMemberId);
      if (targetIndex !== -1) {
        updatedMembers[targetIndex] = {
          ...updatedMembers[targetIndex],
          childrenIds: [...(updatedMembers[targetIndex].childrenIds || []), newMember.id]
        };
      }
      
      // Set parent relationship for new member
      newMember.parentIds = [targetMemberId];
    }

    set({ members: updatedMembers });
    get().updateStats();
  },
}));