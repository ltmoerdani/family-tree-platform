import React, { useState } from 'react';
import { FamilyMember } from '@/types/family';
import { useFamilyStore } from '@/store/familyStore';
import { MapPin, Briefcase, Calendar, Phone, Mail, MoreVertical } from 'lucide-react';

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

  const handleClick = () => {
    setSelectedMember(member);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const calculateAge = () => {
    const birthYear = new Date(member.birthDate).getFullYear();
    const currentYear = member.isAlive ? new Date().getFullYear() : 
                       (member.deathDate ? new Date(member.deathDate).getFullYear() : new Date().getFullYear());
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
    
    if (member.education && member.education.includes('S')) {
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

  return (
    <>
      <div
        className={`relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 ${
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
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowContextMenu(false)}
          />
          <div 
            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-48"
            style={{
              left: contextMenuPosition.x,
              top: contextMenuPosition.y,
            }}
          >
            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
              Edit Profil
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
    </>
  );
};