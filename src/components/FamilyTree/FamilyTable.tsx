import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useFamilyStore } from '@/store/familyStore';
import { FamilyMember } from '@/types/family';
import { 
  ChevronUp, 
  ChevronDown, 
  Phone, 
  Mail, 
  Info, 
  MapPin,
  Users,
  Calendar,
  Filter,
  Download,
  MessageSquare,
  Trash2,
  Eye,
  Settings,
  Search
} from 'lucide-react';

type SortField = 'name' | 'age' | 'generation' | 'location' | 'birthDate' | 'profession';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export const FamilyTable: React.FC = () => {
  const { 
    members, 
    viewMode, 
    searchQuery, 
    selectedMember, 
    setSelectedMember 
  } = useFamilyStore();

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'name', direction: 'asc' });
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    photo: true,
    name: true,
    relationship: true,
    birth: true,
    age: true,
    status: true,
    location: true,
    contact: true
  });

  const tableRef = useRef<HTMLDivElement>(null);

  // Filter and search members
  const filteredMembers = useMemo(() => {
    let filtered = members.filter(member => {
      // Apply view mode filters
      if (!viewMode.showAlive && member.isAlive) return false;
      if (!viewMode.showDeceased && !member.isAlive) return false;
      if (viewMode.selectedGeneration && member.generation !== viewMode.selectedGeneration) return false;
      
      // Apply global search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesGlobal = (
          member.name.toLowerCase().includes(query) ||
          member.profession?.toLowerCase().includes(query) ||
          member.currentLocation?.toLowerCase().includes(query) ||
          member.nickname?.toLowerCase().includes(query)
        );
        if (!matchesGlobal) return false;
      }

      // Apply column-specific filters
      for (const [column, filter] of Object.entries(columnFilters)) {
        if (!filter) continue;
        const filterLower = filter.toLowerCase();
        
        switch (column) {
          case 'name':
            if (!member.name.toLowerCase().includes(filterLower) && 
                !member.nickname?.toLowerCase().includes(filterLower)) return false;
            break;
          case 'location':
            if (!member.currentLocation?.toLowerCase().includes(filterLower)) return false;
            break;
          case 'profession':
            if (!member.profession?.toLowerCase().includes(filterLower)) return false;
            break;
        }
      }
      
      return true;
    });

    // Sort members
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortConfig.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'age':
          const ageA = calculateAge(a.birthDate, a.deathDate);
          const ageB = calculateAge(b.birthDate, b.deathDate);
          comparison = ageA - ageB;
          break;
        case 'generation':
          comparison = a.generation - b.generation;
          break;
        case 'location':
          comparison = (a.currentLocation || '').localeCompare(b.currentLocation || '');
          break;
        case 'birthDate':
          comparison = new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime();
          break;
        case 'profession':
          comparison = (a.profession || '').localeCompare(b.profession || '');
          break;
      }
      
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [members, viewMode, searchQuery, columnFilters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMembers = itemsPerPage === -1 ? filteredMembers : filteredMembers.slice(startIndex, endIndex);

  const calculateAge = (birthDate: string, deathDate?: string) => {
    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    return end.getFullYear() - birth.getFullYear();
  };

  const getRelationshipText = (member: FamilyMember) => {
    if (member.parentIds && member.parentIds.length > 0) {
      const parent = members.find(m => m.id === member.parentIds![0]);
      return parent ? `Anak dari ${parent.name}` : 'Anak';
    }
    if (member.generation === 1) return 'Kakek/Nenek';
    if (member.generation === 2) return 'Orang Tua';
    return 'Keturunan';
  };

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRowSelect = (memberId: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
    } else {
      newSelected.add(memberId);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === currentMembers.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(currentMembers.map(m => m.id)));
    }
  };

  const handleRowClick = (member: FamilyMember) => {
    setSelectedMember(member);
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

  const SortableHeader: React.FC<{ field: SortField; children: React.ReactNode; className?: string }> = ({ 
    field, 
    children, 
    className = '' 
  }) => (
    <th 
      className={`px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortConfig.field === field && (
          sortConfig.direction === 'asc' ? 
            <ChevronUp className="w-3 h-3" /> : 
            <ChevronDown className="w-3 h-3" />
        )}
      </div>
    </th>
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, columnFilters, viewMode]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Bulk Actions Bar */}
      {selectedRows.size > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedRows.size} anggota dipilih
              </span>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim Pesan</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors">
                  <Users className="w-4 h-4" />
                  <span>Grup</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors">
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
            <button 
              onClick={() => setSelectedRows(new Set())}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Batal Pilih
            </button>
          </div>
        </div>
      )}

      {/* Table Controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
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

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Tampilkan:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={-1}>Semua</option>
              </select>
            </div>

            <button
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Kolom</span>
            </button>
          </div>
        </div>
      </div>

      {/* Column Settings */}
      {showColumnSettings && (
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-6">
            <span className="text-sm font-medium text-gray-700">Tampilkan Kolom:</span>
            {Object.entries(visibleColumns).map(([key, visible]) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={(e) => setVisibleColumns(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 capitalize">
                  {key === 'photo' ? 'Foto' : 
                   key === 'name' ? 'Nama' :
                   key === 'relationship' ? 'Hubungan' :
                   key === 'birth' ? 'Lahir' :
                   key === 'age' ? 'Usia' :
                   key === 'status' ? 'Status' :
                   key === 'location' ? 'Lokasi' :
                   key === 'contact' ? 'Kontak' : key}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div ref={tableRef} className="flex-1 overflow-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={selectedRows.size === currentMembers.length && currentMembers.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              
              {visibleColumns.photo && (
                <th className="px-4 py-3 w-16 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Foto
                </th>
              )}
              
              {visibleColumns.name && (
                <SortableHeader field="name" className="w-48">
                  Nama
                </SortableHeader>
              )}
              
              {visibleColumns.relationship && (
                <th className="px-4 py-3 w-40 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Hubungan
                </th>
              )}
              
              {visibleColumns.birth && (
                <SortableHeader field="birthDate" className="w-28">
                  Lahir
                </SortableHeader>
              )}
              
              {visibleColumns.age && (
                <SortableHeader field="age" className="w-20 text-right">
                  Usia
                </SortableHeader>
              )}
              
              {visibleColumns.status && (
                <th className="px-4 py-3 w-24 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              )}
              
              {visibleColumns.location && (
                <SortableHeader field="location" className="w-32">
                  Lokasi
                </SortableHeader>
              )}
              
              {visibleColumns.contact && (
                <th className="px-4 py-3 w-28 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Kontak
                </th>
              )}
            </tr>

            {/* Filter Row */}
            <tr className="bg-gray-25 border-t border-gray-200">
              <td className="px-4 py-2"></td>
              
              {visibleColumns.photo && <td className="px-4 py-2"></td>}
              
              {visibleColumns.name && (
                <td className="px-4 py-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Filter nama..."
                      value={columnFilters.name || ''}
                      onChange={(e) => setColumnFilters(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </td>
              )}
              
              {visibleColumns.relationship && <td className="px-4 py-2"></td>}
              {visibleColumns.birth && <td className="px-4 py-2"></td>}
              {visibleColumns.age && <td className="px-4 py-2"></td>}
              {visibleColumns.status && <td className="px-4 py-2"></td>}
              
              {visibleColumns.location && (
                <td className="px-4 py-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Filter lokasi..."
                      value={columnFilters.location || ''}
                      onChange={(e) => setColumnFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </td>
              )}
              
              {visibleColumns.contact && <td className="px-4 py-2"></td>}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {currentMembers.map((member, index) => {
              const isSelected = selectedRows.has(member.id);
              const isHighlighted = selectedMember?.id === member.id;
              const age = calculateAge(member.birthDate, member.deathDate);
              
              return (
                <tr
                  key={member.id}
                  className={`h-16 transition-colors cursor-pointer ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } ${
                    isSelected ? 'bg-blue-100' : ''
                  } ${
                    isHighlighted ? 'bg-blue-200 ring-2 ring-blue-400' : ''
                  } hover:bg-blue-50`}
                  onClick={() => handleRowClick(member)}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleRowSelect(member.id);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>

                  {visibleColumns.photo && (
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div 
                            className={`w-full h-full flex items-center justify-center text-white text-sm font-bold ${
                              member.gender === 'male' ? 'bg-blue-400' : 'bg-pink-400'
                            }`}
                          >
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </td>
                  )}

                  {visibleColumns.name && (
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {highlightText(member.name, searchQuery)}
                        </div>
                        {member.nickname && (
                          <div className="text-xs text-gray-500 italic">
                            "{highlightText(member.nickname, searchQuery)}"
                          </div>
                        )}
                      </div>
                    </td>
                  )}

                  {visibleColumns.relationship && (
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {getRelationshipText(member)}
                        </span>
                      </div>
                    </td>
                  )}

                  {visibleColumns.birth && (
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700">
                        {new Date(member.birthDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                  )}

                  {visibleColumns.age && (
                    <td className="px-4 py-3 text-right">
                      <div className={`text-sm font-medium ${
                        member.isAlive ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {age} thn {!member.isAlive && '✝'}
                      </div>
                    </td>
                  )}

                  {visibleColumns.status && (
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          member.isAlive ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                        <span className="text-xs text-gray-700">
                          {member.isAlive ? 'Hidup' : 'Almarhum'}
                        </span>
                      </div>
                    </td>
                  )}

                  {visibleColumns.location && (
                    <td className="px-4 py-3">
                      {member.currentLocation && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-700 truncate">
                            {highlightText(member.currentLocation, searchQuery)}
                          </span>
                        </div>
                      )}
                    </td>
                  )}

                  {visibleColumns.contact && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-1">
                        {member.phone && (
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                            title="WhatsApp"
                          >
                            <Phone className="w-3 h-3" />
                          </button>
                        )}
                        {member.email && (
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Email"
                          >
                            <Mail className="w-3 h-3" />
                          </button>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMember(member);
                          }}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="Detail"
                        >
                          <Info className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Filter className="w-12 h-12 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Tidak ada anggota ditemukan</h3>
            <p className="text-sm text-center">
              Coba ubah filter atau kata kunci pencarian
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {itemsPerPage !== -1 && totalPages > 1 && (
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredMembers.length)} dari {filteredMembers.length} anggota
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 text-sm rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};