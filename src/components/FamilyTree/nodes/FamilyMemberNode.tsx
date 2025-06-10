import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  Edit, 
  Trash2, 
  UserPlus, 
  Heart, 
  Calendar,
  MapPin,
  Briefcase,
  MoreVertical
} from 'lucide-react';
import { FamilyMember } from '../../../types/family';

interface FamilyMemberNodeData {
  member: FamilyMember;
  onEdit: (member: FamilyMember) => void;
  onDelete: (memberId: string) => void;
  onAddChild: (parentId: string) => void;
  onAddSpouse: (memberId: string) => void;
}

export const FamilyMemberNode = memo<NodeProps<FamilyMemberNodeData>>(({ data, selected }) => {
  const { member, onEdit, onDelete, onAddChild, onAddSpouse } = data;
  const [showContextMenu, setShowContextMenu] = useState(false);

  const calculateAge = () => {
    const birthYear = new Date(member.birthDate).getFullYear();
    const endYear = member.isAlive 
      ? new Date().getFullYear() 
      : member.deathDate 
        ? new Date(member.deathDate).getFullYear() 
        : new Date().getFullYear();
    return endYear - birthYear;
  };

  const getYearDisplay = () => {
    const birthYear = new Date(member.birthDate).getFullYear();
    const deathYear = member.deathDate ? new Date(member.deathDate).getFullYear() : null;
    
    if (deathYear) {
      return `(${birthYear}-${deathYear})`;
    }
    return `(${birthYear})`;
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContextMenu(!showContextMenu);
  };

  return (
    <div className="relative">
      {/* Connection handles - positioned for bracket connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-4 h-4 bg-gray-400 border-2 border-white"
        style={{ top: -8 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-4 h-4 bg-gray-400 border-2 border-white"
        style={{ bottom: -8 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 bg-gray-400 border-2 border-white"
        style={{ left: -8 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 bg-gray-400 border-2 border-white"
        style={{ right: -8 }}
      />

      {/* Main card */}
      <div
        className={`
          w-48 bg-white rounded-lg shadow-lg border-2 transition-all duration-200 cursor-pointer
          ${selected ? 'border-blue-500 shadow-xl' : 'border-gray-200 hover:border-gray-300'}
          ${member.gender === 'male' ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-pink-500'}
          ${!member.isAlive ? 'opacity-75 bg-gray-50' : ''}
        `}
        onContextMenu={handleContextMenu}
        onDoubleClick={() => onEdit(member)}
      >
        {/* Generation badge - Moved to top left corner */}
        <div className="absolute -top-2 -left-2">
          <div className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center text-white shadow-sm ${
            member.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
          }`}>
            {member.generation}
          </div>
        </div>

        {/* Status indicators - Keep in top right */}
        <div className="absolute -top-2 -right-2 flex space-x-1">
          {member.maritalStatus === 'married' && (
            <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
              <Heart className="w-3 h-3 text-white" />
            </div>
          )}
          {!member.isAlive && (
            <div className="w-6 h-6 bg-gray-600 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs">✕</span>
            </div>
          )}
        </div>

        {/* Photo and basic info - Updated layout */}
        <div className="p-4">
          {/* Photo */}
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 shadow-sm">
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className={`w-full h-full flex items-center justify-center text-white font-bold text-xl ${
                    member.gender === 'male' ? 'bg-blue-400' : 'bg-pink-400'
                  }`}
                >
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Member info - New layout as per image */}
          <div className="text-center space-y-1">
            {/* Nickname first (if exists) */}
            {member.nickname && (
              <p className="text-sm text-gray-500 italic">
                ({member.nickname})
              </p>
            )}
            
            {/* Full name */}
            <h3 className="font-bold text-gray-900 text-sm leading-tight">
              {member.name}
            </h3>
            
            {/* Birth year and age */}
            <div className="space-y-0.5">
              <p className="text-xs text-gray-600">
                {getYearDisplay()}
              </p>
              <p className="text-xs text-gray-500">
                {calculateAge()} tahun
              </p>
            </div>
          </div>

          {/* Additional info (profession/location) - Compact */}
          {(member.profession || member.currentLocation) && (
            <div className="mt-3 pt-2 border-t border-gray-100">
              <div className="space-y-1 text-xs text-gray-600 text-center">
                {member.profession && (
                  <div className="flex items-center justify-center space-x-1">
                    <Briefcase className="w-3 h-3" />
                    <span className="truncate">{member.profession}</span>
                  </div>
                )}
                
                {member.currentLocation && (
                  <div className="flex items-center justify-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{member.currentLocation}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Context menu */}
      {showContextMenu && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowContextMenu(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2">
            <button
              onClick={() => {
                onEdit(member);
                setShowContextMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
            
            <button
              onClick={() => {
                onAddChild(member.id);
                setShowContextMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Child</span>
            </button>
            
            <button
              onClick={() => {
                onAddSpouse(member.id);
                setShowContextMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Heart className="w-4 h-4" />
              <span>Add Spouse</span>
            </button>
            
            <hr className="my-2" />
            
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this family member?')) {
                  onDelete(member.id);
                }
                setShowContextMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 transition-colors flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
});

FamilyMemberNode.displayName = 'FamilyMemberNode';