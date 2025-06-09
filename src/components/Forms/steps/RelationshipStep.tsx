import React, { useState } from 'react';
import { Users, Search, Plus, Link } from 'lucide-react';
import { FormData } from '../AddMemberModal';
import { FamilyMember } from '@/types/family';

interface RelationshipStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
  members: FamilyMember[];
}

export const RelationshipStep: React.FC<RelationshipStepProps> = ({
  formData,
  updateFormData,
  errors,
  members
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateNew, setShowCreateNew] = useState(false);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedParents = members.filter(m => formData.parentIds.includes(m.id));
  const selectedSpouse = members.find(m => m.id === formData.spouseId);

  const handleParentSelect = (memberId: string) => {
    const newParentIds = formData.parentIds.includes(memberId)
      ? formData.parentIds.filter(id => id !== memberId)
      : [...formData.parentIds, memberId];
    
    updateFormData({ parentIds: newParentIds });
  };

  const handleSpouseSelect = (memberId: string) => {
    updateFormData({ 
      spouseId: formData.spouseId === memberId ? '' : memberId 
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Users className="w-12 h-12 text-blue-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-gray-900">Hubungan Keluarga</h3>
        <p className="text-sm text-gray-600">Tentukan hubungan dengan anggota keluarga lain</p>
      </div>

      {/* Relationship Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Jenis Hubungan <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { value: 'child', label: 'Anak' },
            { value: 'parent', label: 'Orang Tua' },
            { value: 'sibling', label: 'Saudara' },
            { value: 'spouse', label: 'Pasangan' },
            { value: 'other', label: 'Lainnya' }
          ].map(option => (
            <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value={option.value}
                checked={formData.relationshipType === option.value}
                onChange={(e) => updateFormData({ relationshipType: e.target.value as any })}
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Search Members */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cari Anggota Keluarga
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Ketik nama untuk mencari..."
          />
        </div>
      </div>

      {/* Parent Selection */}
      {(formData.relationshipType === 'child' || formData.relationshipType === 'other') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Orang Tua {formData.relationshipType === 'child' && <span className="text-red-500">*</span>}
          </label>
          
          {selectedParents.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">Orang tua terpilih:</p>
              <div className="flex flex-wrap gap-2">
                {selectedParents.map(parent => (
                  <div key={parent.id} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    <span>{parent.name}</span>
                    <button
                      onClick={() => handleParentSelect(parent.id)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
            {filteredMembers.length > 0 ? (
              filteredMembers.map(member => (
                <div
                  key={member.id}
                  className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    formData.parentIds.includes(member.id) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleParentSelect(member.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-sm font-medium text-gray-600">{member.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date().getFullYear() - new Date(member.birthDate).getFullYear()} tahun
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">Tidak ada anggota ditemukan</p>
                <button
                  onClick={() => setShowCreateNew(true)}
                  className="mt-2 flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat anggota baru</span>
                </button>
              </div>
            )}
          </div>

          {errors.parentIds && (
            <p className="mt-1 text-sm text-red-600">{errors.parentIds}</p>
          )}
        </div>
      )}

      {/* Spouse Selection */}
      {formData.relationshipType === 'spouse' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Pasangan <span className="text-red-500">*</span>
          </label>
          
          {selectedSpouse && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">Pasangan terpilih:</p>
              <div className="flex items-center bg-pink-100 text-pink-800 px-3 py-2 rounded-lg">
                <span>{selectedSpouse.name}</span>
                <button
                  onClick={() => handleSpouseSelect(selectedSpouse.id)}
                  className="ml-2 text-pink-600 hover:text-pink-800"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
            {filteredMembers.filter(m => m.gender !== formData.gender).map(member => (
              <div
                key={member.id}
                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  formData.spouseId === member.id ? 'bg-pink-50' : ''
                }`}
                onClick={() => handleSpouseSelect(member.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">{member.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date().getFullYear() - new Date(member.birthDate).getFullYear()} tahun
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {errors.spouseId && (
            <p className="mt-1 text-sm text-red-600">{errors.spouseId}</p>
          )}
        </div>
      )}

      {/* Additional Options */}
      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isAdopted}
            onChange={(e) => updateFormData({ isAdopted: e.target.checked })}
            className="mr-3 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Anak Adopsi</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isHeadOfFamily}
            onChange={(e) => updateFormData({ isHeadOfFamily: e.target.checked })}
            className="mr-3 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Kepala Keluarga</span>
        </label>
      </div>
    </div>
  );
};