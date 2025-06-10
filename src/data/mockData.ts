import { FamilyMember } from '../types/family';

export const mockFamilyData: FamilyMember[] = [
  // Generation 1 (Grandparents)
  {
    id: '1',
    name: 'Budi Wijaya',
    birthDate: '1945-03-15',
    deathDate: '2018-08-20',
    birthPlace: 'Yogyakarta',
    currentLocation: 'Jakarta',
    profession: 'Pensiunan Guru',
    education: 'S1 Pendidikan',
    gender: 'male',
    photoUrl: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
    spouseId: '2',
    childrenIds: ['3', '5'], // Hanya Andi dan Dedi
    isAlive: false,
    generation: 1,
    maritalStatus: 'married',
  },
  {
    id: '2',
    name: 'Siti Wijaya',
    birthDate: '1948-07-22',
    deathDate: '2020-12-10',
    birthPlace: 'Yogyakarta',
    currentLocation: 'Jakarta',
    profession: 'Ibu Rumah Tangga',
    gender: 'female',
    photoUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    spouseId: '1',
    childrenIds: ['3', '5'], // Hanya Andi dan Dedi
    isAlive: false,
    generation: 1,
    maritalStatus: 'married',
  },

  // Generation 2 (Children of Budi & Siti)
  {
    id: '3',
    name: 'Andi Wijaya',
    nickname: 'Pak Andi',
    birthDate: '1970-05-15',
    birthPlace: 'Jakarta',
    currentLocation: 'Jakarta Selatan',
    profession: 'Pengusaha',
    education: 'S1 Ekonomi',
    gender: 'male',
    photoUrl: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
    parentIds: ['1', '2'], // Budi & Siti
    childrenIds: ['6', '7'], // Rudi & Maya
    siblingIds: ['5'], // Hanya Dedi sebagai saudara
    email: 'andi.wijaya@email.com',
    phone: '+62812345678',
    isAlive: true,
    generation: 2,
    maritalStatus: 'married',
  },
  {
    id: '5',
    name: 'Dedi Wijaya',
    birthDate: '1968-11-30',
    birthPlace: 'Jakarta',
    currentLocation: 'Surabaya',
    profession: 'Insinyur',
    education: 'S1 Teknik',
    gender: 'male',
    photoUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    parentIds: ['1', '2'], // Budi & Siti
    spouseId: '4', // Sari sebagai istri
    childrenIds: ['8', '9', '10', '11'], // Arif, Lia, Kenzo, Aira
    siblingIds: ['3'], // Hanya Andi sebagai saudara
    isAlive: true,
    generation: 2,
    maritalStatus: 'married',
  },

  // Sari sebagai istri Dedi (Generation 2, tapi bukan anak Budi & Siti)
  {
    id: '4',
    name: 'Sari Handayani', // Consistent naming dengan keluarga asal berbeda
    birthDate: '1975-09-08',
    birthPlace: 'Bandung',
    currentLocation: 'Surabaya', // Konsisten dengan lokasi keluarga
    profession: 'Dokter',
    education: 'S1 Kedokteran',
    gender: 'female',
    photoUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    spouseId: '5', // Dedi sebagai suami
    childrenIds: ['8', '9', '10', '11'], // Consistent dengan spacing pattern
    email: 'sari.handayani@email.com',
    phone: '+62812345679',
    isAlive: true,
    generation: 2, // Same generation as Dedi untuk spacing consistency
    maritalStatus: 'married',
  },

  // Generation 3 (Grandchildren)
  // Anak-anak Andi (perlu tambah istri Andi untuk kelengkapan)
  {
    id: '6',
    name: 'Rudi Wijaya',
    birthDate: '1998-03-12',
    birthPlace: 'Jakarta',
    currentLocation: 'Jakarta',
    profession: 'Software Engineer',
    education: 'S1 Informatika',
    gender: 'male',
    photoUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    parentIds: ['3'], // Andi (perlu pasangan Andi untuk lengkap)
    siblingIds: ['7'],
    email: 'rudi.wijaya@email.com',
    phone: '+62812345680',
    isAlive: true,
    generation: 3,
    maritalStatus: 'single',
  },
  {
    id: '7',
    name: 'Maya Wijaya',
    birthDate: '2000-07-18',
    birthPlace: 'Jakarta',
    currentLocation: 'Jakarta',
    profession: 'Mahasiswa',
    education: 'S1 Psikologi',
    gender: 'female',
    photoUrl: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150',
    parentIds: ['3'], // Andi
    siblingIds: ['6'],
    email: 'maya.wijaya@email.com',
    phone: '+62812345681',
    isAlive: true,
    generation: 3,
    maritalStatus: 'single',
  },

  // Anak-anak Dedi & Sari
  {
    id: '8',
    name: 'Arif Wijaya',
    birthDate: '1992-01-25',
    birthPlace: 'Surabaya',
    currentLocation: 'Surabaya',
    profession: 'Dokter Gigi',
    education: 'S1 Kedokteran Gigi',
    gender: 'male',
    photoUrl: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150',
    parentIds: ['5', '4'], // Dedi & Sari sebagai orang tua
    siblingIds: ['9', '10', '11'],
    isAlive: true,
    generation: 3,
    maritalStatus: 'married',
  },
  {
    id: '9',
    name: 'Lia Wijaya',
    birthDate: '1995-06-14',
    birthPlace: 'Surabaya',
    currentLocation: 'Bandung',
    profession: 'Desainer',
    education: 'S1 Desain',
    gender: 'female',
    photoUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    parentIds: ['5', '4'], // Dedi & Sari sebagai orang tua
    siblingIds: ['8', '10', '11'],
    isAlive: true,
    generation: 3,
    maritalStatus: 'single',
  },
  {
    id: '10',
    name: 'Kenzo Wijaya',
    birthDate: '1997-09-03',
    birthPlace: 'Surabaya',
    currentLocation: 'Surabaya',
    profession: 'Fotografer',
    education: 'S1 Seni Rupa',
    gender: 'male',
    photoUrl: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
    parentIds: ['5', '4'], // Dedi & Sari sebagai orang tua
    siblingIds: ['8', '9', '11'],
    isAlive: true,
    generation: 3,
    maritalStatus: 'single',
  },
  {
    id: '11',
    name: 'Aira Wijaya',
    birthDate: '1999-12-20',
    birthPlace: 'Surabaya',
    currentLocation: 'Jakarta',
    profession: 'Content Creator',
    education: 'S1 Komunikasi',
    gender: 'female',
    photoUrl: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
    parentIds: ['5', '4'], // Dedi & Sari sebagai orang tua
    siblingIds: ['8', '9', '10'],
    isAlive: true,
    generation: 3,
    maritalStatus: 'single',
  },
];