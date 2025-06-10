// Fix React import for TypeScript
import * as React from 'react';
import { useState } from 'react';
import { FamilyMember } from '../../types/family';
import { useFamilyStore } from '../../store/familyStore';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Edit,
  Trash2,
  Copy,
  Move
} from 'lucide-react';
import { RelationshipSelectionModal } from './RelationshipSelectionModal';
import { UnifiedMemberModal } from '../Forms/UnifiedMemberModal';

interface EditableMemberCardProps {
  member: FamilyMember;
  position: { x: number; y: number };
}

type Direction = 'up' | 'down' | 'left' | 'right';

interface DirectionalPlusButtonProps {
  direction: Direction;
  icon: React.ReactNode;
  tooltip: string;
  className: string;
  onDirectionalAdd: (direction: Direction) => void;
}

const DirectionalPlusButton: React.FC<DirectionalPlusButtonProps> = ({ 
  direction, 
  icon, 
  tooltip, 
  className, 
  onDirectionalAdd 
}: DirectionalPlusButtonProps) => (
  <button
    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onDirectionalAdd(direction);
    }}
    className={`absolute w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl group ${className}`}
    title={tooltip}
  >
    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white">
      {icon}
    </div>
    <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 -top-8 left-1/2 transform -translate-x-1/2">
      {tooltip}
    </div>
  </button>
);

export const EditableMemberCard: React.FC<EditableMemberCardProps> = ({ 
  member, 
  position 
}: EditableMemberCardProps) => {
  const { setSelectedMember, selectedMember, editMode } = useFamilyStore();
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDirection, setSelectedDirection] = useState<Direction>('up');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const handleClick = () => {
    if (editMode) {
      setShowEditModal(true);
    } else {
      setSelectedMember(member);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!editMode) return;
    
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleDirectionalAdd = (direction: Direction) => {
    setSelectedDirection(direction);
    setShowRelationshipModal(true);
  };

  const handleRelationshipSelect = () => {
    setShowRelationshipModal(false);
    setShowAddMemberModal(true);
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

  // Replace nested ternary for border color
  let borderColorClass = '';
  if (editMode) {
    borderColorClass = 'border-blue-500 bg-blue-50 border-4 cursor-pointer';
  } else if (member.gender === 'male') {
    borderColorClass = 'border-blue-200 hover:border-blue-400';
  } else {
    borderColorClass = 'border-pink-200 hover:border-pink-400';
  }

  let selectedBorderClass = '';
  if (isSelected) {
    selectedBorderClass = member.gender === 'male' ? 'border-blue-500 shadow-lg' : 'border-pink-500 shadow-lg';
  }

  return (
    <>
      <div
        className={`absolute transition-all duration-200 ${editMode ? 'hover:scale-105' : 'transform hover:scale-105 hover:z-10'} ${isSelected ? 'z-20 scale-105' : ''}`}
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%)`,
        }}
      >
        {/* Interactive button overlay for accessibility */}
        <button
          type="button"
          className="absolute inset-0 w-full h-full bg-transparent border-none outline-none p-0 m-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl z-10"
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
            if (e.key === 'ContextMenu' || (e.key === 'F10' && e.shiftKey)) {
              e.preventDefault();
              const rect = e.currentTarget.getBoundingClientRect();
              const event = {
                preventDefault: () => {},
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2,
              };
              handleContextMenu(event as React.MouseEvent);
            }
          }}
          aria-label={`${member.name} family member card${editMode ? ' - click to edit or right-click for more options' : ' - click to select'}`}
          aria-describedby={`member-info-${member.id}`}
        />
        
        <div
          id={`member-info-${member.id}`}
          className={`w-40 h-48 bg-white rounded-xl shadow-md hover:shadow-lg border-2 transition-all duration-200 ${borderColorClass} ${selectedBorderClass} ${!member.isAlive ? 'border-gray-400 bg-gray-50' : ''} relative overflow-hidden`}
        >
          {/* Status Indicators */}
          <output
            className="absolute -top-2 -right-2 flex space-x-1 z-20"
            aria-label="Status indicators"
          >
            {member.maritalStatus === 'married' && (
              <div className="w-5 h-5 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                <span className="text-xs">💍</span>
              </div>
            )}
            {!member.isAlive && (
              <div className="w-5 h-5 bg-gray-600 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                <span className="text-xs text-white">✕</span>
              </div>
            )}
          </output>

          {/* Directional Plus Icons - Only in Edit Mode */}
          {editMode && (
            <>
              <DirectionalPlusButton
                direction="up"
                icon={<ArrowUp className="w-4 h-4" />}
                tooltip="Tambah Orang Tua"
                className="-top-5 left-1/2 transform -translate-x-1/2"
                onDirectionalAdd={handleDirectionalAdd}
              />
              <DirectionalPlusButton
                direction="down"
                icon={<ArrowDown className="w-4 h-4" />}
                tooltip="Tambah Anak/Keturunan"
                className="-bottom-5 left-1/2 transform -translate-x-1/2"
                onDirectionalAdd={handleDirectionalAdd}
              />
              <DirectionalPlusButton
                direction="left"
                icon={<ArrowLeft className="w-4 h-4" />}
                tooltip="Tambah Pasangan (Kiri)"
                className="-left-5 top-1/2 transform -translate-y-1/2"
                onDirectionalAdd={handleDirectionalAdd}
              />
              <DirectionalPlusButton
                direction="right"
                icon={<ArrowRight className="w-4 h-4" />}
                tooltip="Tambah Pasangan (Kanan)"
                className="-right-5 top-1/2 transform -translate-y-1/2"
                onDirectionalAdd={handleDirectionalAdd}
              />
            </>
          )}

          {/* Photo */}
          <div className="p-4 pb-2">
            <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gray-200 shadow-sm">
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className={`w-full h-full flex items-center justify-center text-white text-lg font-bold ${
                    member.gender === 'male' ? 'bg-blue-400' : 'bg-pink-400'
                  }`}
                >
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="px-3 pb-4 text-center">
            <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 truncate">
              {member.name}
            </h3>
            {member.nickname && (
              <p className="text-xs text-gray-500 mb-1 italic truncate">
                "{member.nickname}"
              </p>
            )}
            <p className="text-xs text-gray-600">
              {getYearDisplay()}
            </p>
            {member.profession && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {member.profession}
              </p>
            )}
          </div>

          {/* Generation Badge */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white shadow-sm ${
              member.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
            }`}>
              {member.generation}
            </div>
          </div>

          {/* Edit Mode Overlay */}
          {editMode && (
            <div className="absolute inset-0 bg-blue-100 bg-opacity-20 rounded-xl pointer-events-none" />
          )}
        </div>
      </div>

      {/* Context Menu */}
      {showContextMenu && editMode && (
        <>
          {/* Use a button for the overlay for accessibility */}
          <button
            type="button"
            className="fixed inset-0 z-40 bg-transparent p-0 m-0 border-none outline-none"
            aria-label="Close context menu"
            tabIndex={0}
            onClick={() => setShowContextMenu(false)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') setShowContextMenu(false);
            }}
            style={{ cursor: 'default' }}
          />
          <div 
            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-48"
            style={{
              left: contextMenuPosition.x,
              top: contextMenuPosition.y,
            }}
          >
            <button 
              onClick={() => {
                setShowEditModal(true);
                setShowContextMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>

            <button 
              onClick={() => {
                // Handle duplicate
                setShowContextMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>Duplikasi</span>
            </button>

            <button 
              onClick={() => {
                // Handle move
                setShowContextMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Move className="w-4 h-4" />
              <span>Pindahkan</span>
            </button>
            
            <hr className="my-2" />
            
            <button 
              onClick={() => {
                if (confirm('Yakin ingin menghapus anggota ini?')) {
                  // Handle delete
                }
                setShowContextMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 transition-colors flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus</span>
            </button>
          </div>
        </>
      )}

      {/* Modals */}
      <RelationshipSelectionModal
        isOpen={showRelationshipModal}
        onClose={() => setShowRelationshipModal(false)}
        direction={selectedDirection}
        onSelect={handleRelationshipSelect}
      />

      <UnifiedMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
      />

      <UnifiedMemberModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        editingMember={member}
      />
    </>
  );
};