import React, { useState, useMemo } from 'react';
import { GridMemberCard } from './GridMemberCard';
import { useFamilyStore } from '@/store/familyStore';
import { FamilyMember } from '@/types/family';
import { ChevronDown, SortAsc, Filter } from 'lucide-react';

type SortOption = 'name' | 'age' | 'location' | 'generation';
type SortDirection = 'asc' | 'desc';

export const MemberCardGrid: React.FC = () => {
  const { members, viewMode, searchQuery, selectedMember } = useFamilyStore();
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Filter and search members
  const filteredMembers = useMemo(() => {
    let filtered = members.filter(member => {
      // Apply view mode filters
      if (!viewMode.showAlive && member.isAlive) return false;
      if (!viewMode.showDeceased && !member.isAlive) return false;
      if (viewMode.selectedGeneration && member.generation !== viewMode.selectedGeneration) return false;
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          member.name.toLowerCase().includes(query) ||
          member.profession?.toLowerCase().includes(query) ||
          member.currentLocation?.toLowerCase().includes(query) ||
          member.nickname?.toLowerCase().includes(query)
        );
      }
      
      return true;
    });

    // Sort members
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'age':
          const ageA = new Date().getFullYear() - new Date(a.birthDate).getFullYear();
          const ageB = new Date().getFullYear() - new Date(b.birthDate).getFullYear();
          comparison = ageA - ageB;
          break;
        case 'location':
          comparison = (a.currentLocation || '').localeCompare(b.currentLocation || '');
          break;
        case 'generation':
          comparison = a.generation - b.generation;
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [members, viewMode, searchQuery, sortBy, sortDirection]);

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
    setShowSortMenu(false);
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-auto">
      {/* Sort Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {filteredMembers.length} Anggota Keluarga
          </h3>
          
          {searchQuery && (
            <div className="text-sm text-gray-600">
              Hasil pencarian untuk "{searchQuery}"
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SortAsc className="w-4 h-4" />
            <span className="text-sm">
              Urutkan: {sortBy === 'name' ? 'Nama' : sortBy === 'age' ? 'Usia' : sortBy === 'location' ? 'Lokasi' : 'Generasi'}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showSortMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="py-2">
                {[
                  { key: 'name' as SortOption, label: 'Nama' },
                  { key: 'age' as SortOption, label: 'Usia' },
                  { key: 'generation' as SortOption, label: 'Generasi' },
                  { key: 'location' as SortOption, label: 'Lokasi' },
                ].map(option => (
                  <button
                    key={option.key}
                    onClick={() => handleSort(option.key)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      sortBy === option.key ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                    {sortBy === option.key && (
                      <span className="ml-2">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      {filteredMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <Filter className="w-12 h-12 mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">Tidak ada anggota ditemukan</h3>
          <p className="text-sm text-center">
            Coba ubah filter atau kata kunci pencarian
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-6">
          {filteredMembers.map(member => (
            <GridMemberCard
              key={member.id}
              member={member}
              isSelected={selectedMember?.id === member.id}
              highlightText={(text) => highlightText(text, searchQuery)}
            />
          ))}
        </div>
      )}

      {/* Pagination placeholder for future implementation */}
      {filteredMembers.length > 50 && (
        <div className="flex justify-center mt-8">
          <div className="text-sm text-gray-500">
            Menampilkan {Math.min(50, filteredMembers.length)} dari {filteredMembers.length} anggota
          </div>
        </div>
      )}
    </div>
  );
};