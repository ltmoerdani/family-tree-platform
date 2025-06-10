import React from 'react';
import { FamilyMember } from '../../types/family';
import { useFamilyStore } from '../../store/familyStore';

interface MemberCardProps {
  member: FamilyMember;
  position: { x: number; y: number };
  isSelected?: boolean;
  showConnections?: boolean;
}

export const MemberCard: React.FC<MemberCardProps> = ({ 
  member, 
  position, 
  isSelected = false,
  showConnections = true 
}) => {
  const { setSelectedMember, selectedMember } = useFamilyStore();

  const handleClick = () => {
    setSelectedMember(member);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  const getBirthYear = () => {
    return new Date(member.birthDate).getFullYear();
  };

  const getDeathYear = () => {
    return member.deathDate ? new Date(member.deathDate).getFullYear() : null;
  };

  const getYearDisplay = () => {
    const birthYear = getBirthYear();
    const deathYear = getDeathYear();
    
    if (deathYear) {
      return `(${birthYear}-${deathYear})`;
    }
    return `(${birthYear})`;
  };

  const calculateAge = () => {
    const birthYear = getBirthYear();
    const currentYear = member.isAlive ? new Date().getFullYear() : (getDeathYear() ?? new Date().getFullYear());
    return currentYear - birthYear;
  };

  const getCardShape = () => {
    // Laki-laki: kotak dengan sudut sedikit rounded
    // Perempuan: lingkaran/oval
    return member.gender === 'male' ? 'rounded-lg' : 'rounded-full';
  };

  const getBorderColor = () => {
    if (!member.isAlive) return 'border-gray-400';
    if (isSelected || selectedMember?.id === member.id) {
      return member.gender === 'male' ? 'border-blue-500' : 'border-pink-500';
    }
    return member.gender === 'male' ? 'border-blue-200' : 'border-pink-200';
  };

  const getBackgroundColor = () => {
    if (!member.isAlive) return 'bg-gray-50';
    if (isSelected || selectedMember?.id === member.id) {
      return member.gender === 'male' ? 'bg-blue-50' : 'bg-pink-50';
    }
    return 'bg-white';
  };

  const getPhotoBackgroundColor = () => {
    return member.gender === 'male' ? 'bg-blue-400' : 'bg-pink-400';
  };

  const getGenerationBadgeColor = () => {
    return member.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500';
  };

  const getAriaLabel = () => {
    const professionText = member.profession ? `, ${member.profession}` : '';
    const statusText = member.isAlive ? 'masih hidup' : 'almarhum';
    return `Anggota keluarga ${member.name}, ${calculateAge()} tahun, ${statusText}, generasi ${member.generation}${professionText}`;
  };

  const currentlySelected = selectedMember?.id === member.id;

  return (
    <div
      className={`absolute transition-all duration-200 transform hover:scale-105 hover:z-10 ${
        currentlySelected ? 'z-20 scale-105' : ''
      }`}
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%)`,
      }}
    >
      <button
        type="button"
        className={`w-40 ${getBackgroundColor()} ${getCardShape()} shadow-md hover:shadow-lg border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
          getBorderColor()
        } ${
          currentlySelected ? 'shadow-lg ring-2 ring-blue-400' : ''
        } ${
          !member.isAlive ? 'opacity-75' : ''
        }`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={getAriaLabel()}
        aria-pressed={currentlySelected}
      >
        {/* Status Indicators */}
        <div className="absolute -top-2 -right-2 flex space-x-1 z-10">
          {member.maritalStatus === 'married' && (
            <div className="w-4 h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-xs" aria-hidden="true">💍</span>
            </div>
          )}
          {!member.isAlive && (
            <div className="w-4 h-4 bg-gray-600 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-xs text-white" aria-hidden="true">✕</span>
            </div>
          )}
        </div>

        {/* Photo */}
        <div className="p-4 pb-2">
          <div className={`w-20 h-20 mx-auto ${member.gender === 'female' ? 'rounded-full' : 'rounded-lg'} overflow-hidden bg-gray-200`}>
            {member.photoUrl ? (
              <img
                src={member.photoUrl}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div 
                className={`w-full h-full flex items-center justify-center text-white text-2xl font-bold ${
                  getPhotoBackgroundColor()
                }`}
              >
                {member.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="px-4 pb-4 text-center">
          <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">
            {member.name}
          </h3>
          {member.nickname && (
            <p className="text-xs text-gray-500 mb-1 italic">
              "{member.nickname}"
            </p>
          )}
          <p className="text-xs text-gray-600 mb-1">
            {getYearDisplay()}
          </p>
          <p className="text-xs text-gray-500">
            {calculateAge()} tahun
          </p>
          {member.profession && (
            <p className="text-xs text-gray-500 mt-1 truncate">
              {member.profession}
            </p>
          )}
        </div>

        {/* Generation Badge */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white ${
            getGenerationBadgeColor()
          }`}>
            {member.generation}
          </div>
        </div>

        {/* Connection Points for Lines */}
        {showConnections && (
          <>
            {/* Top connection point (for parents) */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Bottom connection point (for children) */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Left connection point (for spouse/siblings) */}
            <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Right connection point (for spouse/siblings) */}
            <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        )}
      </button>
    </div>
  );
};