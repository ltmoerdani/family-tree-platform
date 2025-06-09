import React from 'react';
import { FamilyMember } from '@/types/family';
import { useFamilyStore } from '@/store/familyStore';

interface MemberCardProps {
  member: FamilyMember;
  position: { x: number; y: number };
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, position }) => {
  const { setSelectedMember, selectedMember } = useFamilyStore();

  const handleClick = () => {
    setSelectedMember(member);
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

  const isSelected = selectedMember?.id === member.id;

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-200 transform hover:scale-105 hover:z-10 ${
        isSelected ? 'z-20 scale-105' : ''
      }`}
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%)`,
      }}
      onClick={handleClick}
    >
      <div
        className={`w-40 bg-white rounded-lg shadow-md hover:shadow-lg border-2 ${
          member.gender === 'male' 
            ? 'border-blue-200 hover:border-blue-400' 
            : 'border-pink-200 hover:border-pink-400'
        } ${
          isSelected 
            ? member.gender === 'male' 
              ? 'border-blue-500 shadow-lg' 
              : 'border-pink-500 shadow-lg'
            : ''
        } ${
          !member.isAlive ? 'border-gray-400 bg-gray-50' : ''
        }`}
      >
        {/* Status Indicators */}
        <div className="absolute -top-2 -right-2 flex space-x-1">
          {member.maritalStatus === 'married' && (
            <div className="w-4 h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-xs">💍</span>
            </div>
          )}
          {!member.isAlive && (
            <div className="w-4 h-4 bg-gray-600 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-xs text-white">✕</span>
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
                  member.gender === 'male' ? 'bg-blue-400' : 'bg-pink-400'
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
      </div>
    </div>
  );
};