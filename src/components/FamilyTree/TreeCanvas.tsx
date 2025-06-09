import * as React from 'react';
import { useRef, useState, useCallback, useEffect } from 'react';
import { EditableMemberCard } from './EditableMemberCard';
import { MemberCard } from './MemberCard';
import { useFamilyStore } from '../../store/familyStore';
import { FamilyMember } from '../../types/family';

export const TreeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { members, viewMode, editMode, setEditMode } = useFamilyStore();
  
  // Pan/drag state for canvas navigation
  const [panOffset, setPanOffset] = useState({ x: -1500, y: -300 }); // Start centered on expanded canvas
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [initialPanOffset, setInitialPanOffset] = useState({ x: 0, y: 0 });
  
  // Calculate positions for family members with expanded canvas
  const calculatePositions = (): Record<string, { x: number; y: number }> => {
    const positions: Record<string, { x: number; y: number }> = {};
    const generationGroups: Record<number, FamilyMember[]> = {};
    
    // Group members by generation
    members.forEach(member => {
      if (!generationGroups[member.generation]) {
        generationGroups[member.generation] = [];
      }
      generationGroups[member.generation].push(member);
    });

    // Use much larger virtual canvas for better navigation
    const VIRTUAL_CANVAS_WIDTH = 5000; // Increased from 1200
    const generationHeight = 350; // Increased spacing
    const cardSpacing = 300; // Increased horizontal spacing
    const startingOffsetX = 1000; // Start further from left edge
    const startingOffsetY = 200; // Start further from top

    const generationKeys = Object.keys(generationGroups).map(Number).sort((a, b) => a - b);

    generationKeys.forEach((generation, genIndex) => {
      const membersInGen = generationGroups[generation];
      const totalWidth = (membersInGen.length - 1) * cardSpacing;
      
      // Center each generation horizontally within the virtual canvas
      const startX = startingOffsetX + (VIRTUAL_CANVAS_WIDTH - totalWidth) / 2;
      const y = startingOffsetY + (genIndex * generationHeight);

      membersInGen.forEach((member, memberIndex) => {
        const x = startX + (memberIndex * cardSpacing);
        positions[member.id] = { x, y };
      });
    });

    return positions;
  };

  const positions = calculatePositions();

  // Mouse event handlers for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button only
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setInitialPanOffset({ ...panOffset });
      e.preventDefault();
    }
  }, [panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      
      setPanOffset({
        x: initialPanOffset.x + deltaX,
        y: initialPanOffset.y + deltaY
      });
    }
  }, [isPanning, panStart, initialPanOffset]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Global mouse events for panning
  useEffect(() => {
    if (isPanning) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - panStart.x;
        const deltaY = e.clientY - panStart.y;
        
        setPanOffset({
          x: initialPanOffset.x + deltaX,
          y: initialPanOffset.y + deltaY
        });
      };

      const handleGlobalMouseUp = () => {
        setIsPanning(false);
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isPanning, panStart, initialPanOffset]);

  // Handle click on empty area to exit edit mode
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && editMode && !isPanning) {
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
      className={`flex-1 bg-gray-50 relative transition-all duration-200 ${
        editMode ? 'bg-blue-25' : ''
      } ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: `${panOffset.x % 20}px ${panOffset.y % 20}px`,
        overflow: 'hidden', // Changed from overflow-hidden class to explicit style
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
      aria-label="Family tree canvas - drag to pan, click to interact, press Escape to exit edit mode"
    >
      {/* Large draggable canvas container */}
      <div 
        className="relative pointer-events-none"
        style={{
          width: '5000px', // Much wider canvas
          height: '4000px', // Much taller canvas
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${viewMode.zoom / 100})`,
          transformOrigin: 'top left',
        }}
      >
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
        <div style={{ position: 'relative', zIndex: 10 }} className="pointer-events-auto">
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
            className={`absolute left-4 px-3 py-1 rounded-full shadow-sm border text-sm font-medium transition-colors pointer-events-none ${
              editMode 
                ? 'bg-blue-100 border-blue-300 text-blue-800' 
                : 'bg-white border-gray-300 text-gray-600'
            }`}
            style={{
              top: 120 + ((parseInt(generation) - 1) * 350), // Updated spacing
            }}
          >
            Generasi {generation}
          </div>
        ))}

        {/* Edit Mode Overlay Instructions */}
        {editMode && filteredMembers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
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
      </div>

    </section>
  );
};
