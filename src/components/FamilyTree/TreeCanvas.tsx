// Fix React import for TypeScript
import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { EditableMemberCard } from './EditableMemberCard';
import { MemberCard } from './MemberCard';
import { useFamilyStore } from '../../store/familyStore';
import { FamilyMember } from '../../types/family';

export const TreeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { members, viewMode, editMode, setEditMode } = useFamilyStore();
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  // Calculate positions for family members
  const calculatePositions = () => {
    const positions: Record<string, { x: number; y: number }> = {};
    const generationGroups: Record<number, FamilyMember[]> = {};
    
    // Group members by generation
    members.forEach(member => {
      if (!generationGroups[member.generation]) {
        generationGroups[member.generation] = [];
      }
      generationGroups[member.generation].push(member);
    });

    // Provide a compare function for numeric sort
    const generationKeys = Object.keys(generationGroups).map(Number).sort((a, b) => a - b);
    const canvasWidth = canvasSize.width ?? 1200;
    // Remove unused canvasHeight assignment
    // const canvasHeight = canvasSize.height ?? 800;
    const generationHeight = 250;
    const cardSpacing = 200;

    generationKeys.forEach((generation, genIndex) => {
      const membersInGen = generationGroups[generation];
      const totalWidth = (membersInGen.length - 1) * cardSpacing;
      const startX = (canvasWidth - totalWidth) / 2;
      const y = 150 + (genIndex * generationHeight);

      membersInGen.forEach((member, memberIndex) => {
        const x = startX + (memberIndex * cardSpacing);
        positions[member.id] = { x, y };
      });
    });

    return positions;
  };

  const positions = calculatePositions();

  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        setCanvasSize({
          width: canvasRef.current.offsetWidth,
          height: canvasRef.current.offsetHeight,
        });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Handle click on empty area to exit edit mode
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && editMode) {
      setEditMode(false);
    }
  };

  // Filter members based on view settings
  const filteredMembers = members.filter(member => {
    if (!viewMode.showAlive && member.isAlive) return false;
    if (!viewMode.showDeceased && !member.isAlive) return false;
    if (viewMode.selectedGeneration && member.generation !== viewMode.selectedGeneration) return false;
    return true;
  });

  return (
    <section 
      ref={canvasRef}
      className={`flex-1 bg-gray-50 relative overflow-auto transition-all duration-200 ${
        editMode ? 'bg-blue-25' : ''
      }`}
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        transform: `scale(${viewMode.zoom / 100})`,
        transformOrigin: 'top left',
      }}
      aria-label="Family tree canvas - click to interact, press Escape to exit edit mode"
    >
      {/* Interactive overlay for click and keyboard handling */}
      <button
        type="button"
        className="absolute inset-0 w-full h-full bg-transparent border-none outline-none p-0 m-0 cursor-default focus:outline-none"
        onClick={handleCanvasClick}
        onKeyDown={e => {
          // Allow keyboard users to exit edit mode with Escape
          if (e.key === 'Escape' && editMode) setEditMode(false);
        }}
        aria-label="Canvas interaction area"
        style={{ zIndex: 1 }}
      />
      
      {/* Connection Lines SVG */}
      <svg 
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Render family connection lines here */}
        {filteredMembers.map(member => {
          const memberPos = positions[member.id];
          if (!memberPos) return null;

          // Draw lines to children
          return member.childrenIds?.map((childId: string) => {
            const childPos = positions[childId];
            if (!childPos) return null;

            return (
              <line
                key={`${member.id}-${childId}`}
                x1={memberPos.x}
                y1={memberPos.y + 60}
                x2={childPos.x}
                y2={childPos.y - 60}
                stroke="#6B7280"
                strokeWidth="2"
                className="hover:stroke-blue-500 transition-colors"
              />
            );
          });
        })}

        {/* Draw marriage connections */}
        {filteredMembers.map(member => {
          if (!member.spouseId) return null;
          
          const memberPos = positions[member.id];
          const spousePos = positions[member.spouseId];
          
          if (!memberPos || !spousePos) return null;

          return (
            <line
              key={`marriage-${member.id}-${member.spouseId}`}
              x1={memberPos.x}
              y1={memberPos.y}
              x2={spousePos.x}
              y2={spousePos.y}
              stroke="#EF4444"
              strokeWidth="3"
              strokeDasharray="5,5"
              className="hover:stroke-red-600 transition-colors"
            />
          );
        })}
      </svg>

      {/* Render Member Cards */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {filteredMembers.map(member => {
          const position = positions[member.id];
          if (!position) return null;

          return editMode ? (
            <EditableMemberCard
              key={member.id}
              member={member}
              position={position}
            />
          ) : (
            <MemberCard
              key={member.id}
              member={member}
              position={position}
            />
          );
        })}
      </div>

      {/* Generation Labels */}
      {Object.keys(
        filteredMembers.reduce((acc, member) => {
          acc[member.generation] = true;
          return acc;
        }, {} as Record<number, boolean>)
      ).map(generation => (
        <div
          key={`gen-${generation}`}
          className={`absolute left-4 px-3 py-1 rounded-full shadow-sm border text-sm font-medium transition-colors ${
            editMode 
              ? 'bg-blue-100 border-blue-300 text-blue-800' 
              : 'bg-white border-gray-300 text-gray-600'
          }`}
          style={{
            top: 120 + ((parseInt(generation) - 1) * 250),
          }}
        >
          Generasi {generation}
        </div>
      ))}

      {/* Edit Mode Overlay Instructions */}
      {editMode && filteredMembers.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg border-2 border-blue-200">
            <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Mode Edit Aktif
            </h3>
            <p className="text-gray-600 mb-4">
              Mulai membangun pohon keluarga dengan menambahkan anggota pertama
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Tambah Anggota Pertama
            </button>
          </div>
        </div>
      )}
    </section>
  );
};