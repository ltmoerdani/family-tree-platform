export interface FamilyMember {
  id: string;
  name: string;
  nickname?: string;
  birthDate: string;
  deathDate?: string;
  birthPlace?: string;
  currentLocation?: string;
  profession?: string;
  education?: string;
  gender: 'male' | 'female';
  photoUrl?: string;
  spouseId?: string;
  parentIds?: string[];
  childrenIds?: string[];
  siblingIds?: string[];
  email?: string;
  phone?: string;
  isAlive: boolean;
  generation: number;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  created_at?: string;
  updated_at?: string;
}

export interface FamilyStats {
  totalMembers: number;
  totalGenerations: number;
  maleCount: number;
  femaleCount: number;
  ageDistribution: {
    '0-18': number;
    '19-35': number;
    '36-60': number;
    '60+': number;
  };
  locationDistribution: Record<string, number>;
}

export interface ViewMode {
  type: 'tree' | 'card' | 'list';
  zoom: number;
  showDeceased: boolean;
  showAlive: boolean;
  selectedGeneration: number | null;
}

export interface TreePosition {
  x: number;
  y: number;
  scale: number;
}