import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, Calendar, Briefcase, GraduationCap, Heart, MessageCircle, Edit } from 'lucide-react';
import { useFamilyStore } from '../../store/familyStore';
import { UnifiedMemberModal } from '../Forms/UnifiedMemberModal';

export const MemberDetailSidebar: React.FC = () => {
  const { selectedMember, setSelectedMember } = useFamilyStore();
  const [showEditModal, setShowEditModal] = useState(false);

  if (!selectedMember) return null;

  const calculateAge = (birthDate: string, deathDate?: string) => {
    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    return end.getFullYear() - birth.getFullYear();
  };

  const handleClose = () => {
    setSelectedMember(null);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  return (
    <>
      <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Detail Anggota</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-800"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Photo */}
        <div className="text-center mb-6">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
            {selectedMember.photoUrl ? (
              <img
                src={selectedMember.photoUrl}
                alt={selectedMember.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-bold">
                {selectedMember.name.charAt(0)}
              </div>
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{selectedMember.name}</h3>
          {selectedMember.nickname && (
            <p className="text-gray-600">"{selectedMember.nickname}"</p>
          )}
        </div>

        {/* Basic Information */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Tanggal Lahir</p>
              <p className="font-medium">
                {new Date(selectedMember.birthDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Usia</p>
              <p className="font-medium">
                {calculateAge(selectedMember.birthDate, selectedMember.deathDate)} tahun
                {!selectedMember.isAlive && ' (alm.)'}
              </p>
            </div>
          </div>

          {selectedMember.birthPlace && (
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Tempat Lahir</p>
                <p className="font-medium">{selectedMember.birthPlace}</p>
              </div>
            </div>
          )}

          {selectedMember.currentLocation && (
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Tempat Tinggal</p>
                <p className="font-medium">{selectedMember.currentLocation}</p>
              </div>
            </div>
          )}

          {selectedMember.profession && (
            <div className="flex items-center space-x-3">
              <Briefcase className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Profesi</p>
                <p className="font-medium">{selectedMember.profession}</p>
              </div>
            </div>
          )}

          {selectedMember.education && (
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Pendidikan</p>
                <p className="font-medium">{selectedMember.education}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <Heart className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Status Pernikahan</p>
              <p className="font-medium">
                {selectedMember.maritalStatus === 'married' && 'Menikah'}
                {selectedMember.maritalStatus === 'single' && 'Belum Menikah'}
                {selectedMember.maritalStatus === 'divorced' && 'Bercerai'}
                {selectedMember.maritalStatus === 'widowed' && 'Janda/Duda'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        {(selectedMember.phone || selectedMember.email) && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Kontak</h4>
            <div className="space-y-3">
              {selectedMember.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">{selectedMember.phone}</span>
                </div>
              )}
              {selectedMember.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">{selectedMember.email}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={handleEdit}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Profil
          </button>
          
          {selectedMember.phone && (
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          )}
          
          {selectedMember.email && (
            <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </button>
          )}
          
          <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Share Profil
          </button>
        </div>
      </div>

      <UnifiedMemberModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        editingMember={selectedMember}
      />
    </>
  );
};