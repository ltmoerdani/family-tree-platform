import { FamilyMember } from '../types/family';

export const mockFamilyData: FamilyMember[] = [
  // Generation 1 (Parents/Grandparents) - Abdul Rahman & Zulmelia
  {
    id: '1',
    name: 'Abdul Rahman',
    nickname: 'Oman',
    birthDate: '1960-01-05',
    deathDate: '2022-12-08',
    birthPlace: 'Indonesia',
    currentLocation: 'Indonesia',
    profession: 'Kepala Keluarga',
    gender: 'male',
    photoUrl: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
    spouseId: '2',
    childrenIds: ['3', '5', '7'], // Dita, Zulharman, Ismi
    isAlive: false,
    generation: 1,
    maritalStatus: 'married',
  },
  {
    id: '2',
    name: 'Zulmelia',
    nickname: 'Bundo',
    birthDate: '1962-07-27',
    birthPlace: 'Indonesia',
    currentLocation: 'Indonesia',
    profession: 'Ibu Rumah Tangga',
    gender: 'female',
    photoUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    spouseId: '1',
    childrenIds: ['3', '5', '7'], // Dita, Zulharman, Ismi
    isAlive: true,
    generation: 1,
    maritalStatus: 'married',
  },

  // Generation 2 (Children of Abdul Rahman & Zulmelia)
  {
    id: '3',
    name: 'Dita Yunita Rahman',
    nickname: 'Dita',
    birthDate: '1992-06-14',
    birthPlace: 'Indonesia',
    currentLocation: 'Indonesia',
    profession: 'Profesional',
    gender: 'female',
    photoUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    parentIds: ['1', '2'], // Abdul Rahman & Zulmelia
    spouseId: '4', // Laksmana Tri Moerdani
    siblingIds: ['5', '7'], // Zulharman & Ismi
    isAlive: true,
    generation: 2,
    maritalStatus: 'married',
  },
  {
    id: '4',
    name: 'Laksmana Tri Moerdani',
    nickname: 'Oci',
    birthDate: '1984-11-02',
    birthPlace: 'Indonesia',
    currentLocation: 'Indonesia',
    profession: 'Profesional',
    gender: 'male',
    photoUrl: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
    spouseId: '3', // Dita Yunita Rahman
    isAlive: true,
    generation: 2,
    maritalStatus: 'married',
  },
  {
    id: '5',
    name: 'Zulharman Maddani',
    nickname: 'Arman',
    birthDate: '1994-01-01',
    birthPlace: 'Indonesia',
    currentLocation: 'Indonesia',
    profession: 'Profesional',
    gender: 'male',
    photoUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    parentIds: ['1', '2'], // Abdul Rahman & Zulmelia
    siblingIds: ['3', '7'], // Dita & Ismi
    isAlive: true,
    generation: 2,
    maritalStatus: 'single',
  },
  {
    id: '7',
    name: 'Ismi Tri Oktaviani',
    nickname: 'Ismi',
    birthDate: '1996-10-30',
    birthPlace: 'Indonesia',
    currentLocation: 'Indonesia',
    profession: 'Profesional',
    gender: 'female',
    photoUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    parentIds: ['1', '2'], // Abdul Rahman & Zulmelia
    siblingIds: ['3', '5'], // Dita & Zulharman
    isAlive: true,
    generation: 2,
    maritalStatus: 'single',
  },
];