import { FamilyMember } from './family';

/**
 * Dashboard-related type definitions
 * Following guideline #21 (Component Contracts) for explicit TypeScript interfaces
 */

export interface FamilyTree {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  isPublic: boolean;
  ownerId: string;
}

export interface FamilyTreeNavigationState {
  treeId: string;
  familyTree: FamilyTree;
  currentFamilyTreeName: string;
}

export interface NavigationHandlers {
  setMembers: (members: FamilyMember[]) => void;
}

export type AppView = 'dashboard' | 'family-tree' | 'upgrade';

export interface ViewNavigationResult {
  view: AppView;
  treeId?: string;
}
