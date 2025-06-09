import React from 'react';
import { FamilyMember } from '../../types/family';
import { useFamilyStore } from '../../store/familyStore';

interface MemberCardProps {
  member: FamilyMember;
  position: { x: number; y: number };
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, position }) => {
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

  const getBorderColorClass = () => {
    if (!member.isAlive) return 'border-gray-400';
    if (isSelected) {
      return member.gender === 'male' ? 'border-blue-500' : 'border-pink-500';
    }
    return member.gender === 'male' ? 'border-blue-200' : 'border-pink-200';
  };

  const getHoverBorderColorClass = () => {
    return member.gender === 'male' ? 'hover:border-blue-400' : 'hover:border-pink-400';
  };

  const getSelectedShadowClass = () => {
    return isSelected ? 'shadow-lg' : '';
  };

  const getPhotoBackgroundClass = () => {
    return member.gender === 'male' ? 'bg-blue-400' : 'bg-pink-400';
  };

  const getAriaLabel = () => {
    const professionText = member.profession ? `, ${member.profession}` : '';
    return `Select family member ${member.name}, born ${getBirthYear()}${professionText}`;
  };

  const isSelected = selectedMember?.id === member.id;

  return (
    <div
      className={`absolute transition-all duration-200 transform hover:scale-105 hover:z-10 ${
        isSelected ? 'z-20 scale-105' : ''
      }`}
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%)`,
      }}
    >
      <button
        type="button"
        className={`w-40 bg-white rounded-lg shadow-md hover:shadow-lg border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          getBorderColorClass()
        } ${
          getHoverBorderColorClass()
        } ${
          getSelectedShadowClass()
        } ${
          !member.isAlive ? 'bg-gray-50' : ''
        }`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={getAriaLabel()}
        aria-pressed={isSelected}
      >
        {/* Status Indicators */}
        <div className="absolute -top-2 -right-2 flex space-x-1">
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
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-200">
            {member.photoUrl ? (
              <img
                src={member.photoUrl}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div 
                className={`w-full h-full flex items-center justify-center text-white text-2xl font-bold ${
                  getPhotoBackgroundClass()
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
          <p className="text-xs text-gray-600">
            {getYearDisplay()}
          </p>
          {member.profession && (
            <p className="text-xs text-gray-500 mt-1 truncate">
              {member.profession}
            </p>
          )}
        </div>

        {/* Generation Indicator */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white ${
            member.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
          }`}>
            {member.generation}
          </div>
        </div>
      </button>
    </div>
  );
};