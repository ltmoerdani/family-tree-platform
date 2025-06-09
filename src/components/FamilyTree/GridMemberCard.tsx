import React, { useState } from 'react';
import { FamilyMember } from '../../types/family';
import { useFamilyStore } from '../../store/familyStore';
import { MapPin, Briefcase, Calendar, Phone, Mail, Edit, Plus } from 'lucide-react';
import { AddMemberModal } from '../Forms/AddMemberModal';

interface GridMemberCardProps {
  member: FamilyMember;
  isSelected: boolean;
  highlightText: (text: string) => React.ReactNode;
}

export const GridMemberCard: React.FC<GridMemberCardProps> = ({ 
  member, 
  isSelected, 
  highlightText 
}) => {
  const { setSelectedMember } = useFamilyStore();
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddChildModal, setShowAddChildModal] = useState(false);

  const handleClick = () => {
    setSelectedMember(member);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleEdit = () => {
    setShowEditModal(true);
    setShowContextMenu(false);
  };

  const handleAddChild = () => {
    setShowAddChildModal(true);
    setShowContextMenu(false);
  };

  const calculateAge = () => {
    const birthYear = new Date(member.birthDate).getFullYear();
    const getCurrentYear = () => {
      if (member.isAlive) {
        return new Date().getFullYear();
      }
      return member.deathDate ? new Date(member.deathDate).getFullYear() : new Date().getFullYear();
    };
    const currentYear = getCurrentYear();
    return currentYear - birthYear;
  };

  const getYearDisplay = () => {
    const birthYear = new Date(member.birthDate).getFullYear();
    const deathYear = member.deathDate ? new Date(member.deathDate).getFullYear() : null;
    
    if (deathYear) {
      return `(${birthYear}-${deathYear})`;
    }
    return `(${birthYear})`;
  };

  const getStatusIcons = () => {
    const icons = [];
    
    if (member.maritalStatus === 'married') {
      icons.push(
        <div key="married\" className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
          💍
        </div>
      );
    }
    
    if (member.education?.includes('S')) {
      icons.push(
        <div key="education" className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">
          🎓
        </div>
      );
    }
    
    if (!member.isAlive) {
      icons.push(
        <div key="deceased" className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center text-xs text-white">
          ✕
        </div>
      );
    }
    
    return icons;
  };

  const getAriaLabel = () => {
    const professionText = member.profession ? `, ${member.profession}` : '';
    return `Family member ${member.name}, ${calculateAge()} years old, generation ${member.generation}${professionText}`;
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    } else if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      setContextMenuPosition({ 
        x: rect.left + rect.width / 2, 
        y: rect.top + rect.height / 2 
      });
      setShowContextMenu(true);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full text-left ${
          isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
        } ${
          member.gender === 'male' 
            ? 'border-2 border-blue-200 hover:border-blue-400' 
            : 'border-2 border-pink-200 hover:border-pink-400'
        } ${
          !member.isAlive ? 'border-gray-400 bg-gray-50' : ''
        }`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onKeyDown={handleKeyDown}
        aria-label={getAriaLabel()}
        aria-pressed={isSelected}
      >
        {/* Status Icons */}
        <div className="absolute -top-2 -right-2 flex space-x-1 z-10">
          {getStatusIcons()}
        </div>

        {/* Photo */}
        <div className="p-4 pb-2">
          <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-full overflow-hidden bg-gray-200 mb-3">
            {member.photoUrl ? (
              <img
                src={member.photoUrl}
                alt={member.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div 
                className={`w-full h-full flex items-center justify-center text-white text-lg lg:text-xl font-bold ${
                  member.gender === 'male' ? 'bg-blue-400' : 'bg-pink-400'
                }`}
              >
                {member.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="px-4 pb-4 text-center">
          <h3 className="font-bold text-gray-900 text-sm lg:text-base leading-tight mb-1">
            {highlightText(member.name)}
          </h3>
          
          {member.nickname && (
            <p className="text-xs text-gray-500 mb-1">
              "{highlightText(member.nickname)}"
            </p>
          )}
          
          <p className="text-xs lg:text-sm text-gray-600 mb-2">
            {getYearDisplay()}
          </p>
          
          <p className="text-xs text-gray-500 mb-2">
            {calculateAge()} tahun
          </p>
        </div>

        {/* Additional Info - Visible on Hover */}
        <div className="absolute inset-x-0 bottom-0 bg-white bg-opacity-95 backdrop-blur-sm rounded-b-lg p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-gray-100">
          <div className="space-y-2 text-xs">
            {member.profession && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Briefcase className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{highlightText(member.profession)}</span>
              </div>
            )}
            
            {member.currentLocation && (
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{highlightText(member.currentLocation)}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span>Generasi {member.generation}</span>
            </div>
          </div>
        </div>

        {/* Generation Badge */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white ${
            member.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
          }`}>
            {member.generation}
          </div>
        </div>
      </button>

      {/* Context Menu */}
      {showContextMenu && (
        <>
          <button 
            type="button"
            className="fixed inset-0 z-40 cursor-default bg-transparent border-none p-0 m-0 outline-none"
            onClick={() => setShowContextMenu(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowContextMenu(false);
              }
            }}
            aria-label="Close context menu"
          />
          <div 
            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-48"
            style={{
              left: contextMenuPosition.x,
              top: contextMenuPosition.y,
            }}
          >
            <button 
              onClick={handleEdit}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profil</span>
            </button>

            <button 
              onClick={handleAddChild}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Anak</span>
            </button>
            
            {member.phone && (
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
            )}
            
            {member.email && (
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>
            )}
            
            <hr className="my-2" />
            
            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
              Share Profil
            </button>
          </div>
        </>
      )}

      {/* Modals */}
      <AddMemberModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        editingMember={member}
      />

      <AddMemberModal
        isOpen={showAddChildModal}
        onClose={() => setShowAddChildModal(false)}
        preselectedParent={member}
      />
    </>
  );
};