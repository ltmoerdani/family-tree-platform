import * as React from 'react';
import { useRef, useState, useCallback, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { EditableMemberCard } from './EditableMemberCard';
import { MemberCard } from './MemberCard';
import { FamilyTreeConnections } from './FamilyTreeConnections.tsx';
import { useFamilyStore } from '../../store/familyStore';
import { FamilyMember } from '../../types/family';

/**
 * Enhanced family grouping function for better organization
 * @param members - Array of family members to sort
 * @returns Sorted array with family groups organized properly
 */
const sortMembersByFamilyGroups = (members: FamilyMember[]): FamilyMember[] => {
  const familyGroups: Record<string, FamilyMember[]> = {};
  
  // Group members by family units
  members.forEach(member => {
    let groupKey = 'single';
    
    // Group by parent relationship (siblings)
    if (member.parentIds && member.parentIds.length > 0) {
      // Create sorted parent key for consistent grouping
      const sortedParentIds = [...member.parentIds].sort((a: string, b: string) => a.localeCompare(b));
      groupKey = sortedParentIds.join('-');
    }
    // Group spouses together
    else if (member.spouseId) {
      const spouseInSameGen = members.find(m => m.id === member.spouseId);
      if (spouseInSameGen) {
        // Create sorted couple key for consistent grouping
        const coupleIds = [member.id, member.spouseId].sort((a: string, b: string) => a.localeCompare(b));
        groupKey = coupleIds.join('-couple');
      }
    }
    
    if (!familyGroups[groupKey]) {
      familyGroups[groupKey] = [];
    }
    familyGroups[groupKey].push(member);
  });
  
  // Sort within each group and flatten using compatible method for immutability
  const sorted: FamilyMember[] = [];
  Object.values(familyGroups).forEach(group => {
    // Sort spouses to be adjacent using localeCompare for reliability
    const sortedGroup = [...group].sort((a: FamilyMember, b: FamilyMember) => {
      if (a.spouseId === b.id) return -1;
      if (b.spouseId === a.id) return 1;
      return a.name.localeCompare(b.name);
    });
    sorted.push(...sortedGroup);
  });
  
  return sorted;
};

export const TreeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { members, viewMode, editMode, setEditMode, setViewMode, selectedMember, setSelectedMember } = useFamilyStore();
  
  // Pan/drag state for canvas navigation
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [initialPanOffset, setInitialPanOffset] = useState({ x: 0, y: 0 });
  const [isInitialPositionSet, setIsInitialPositionSet] = useState(false);
  
  // Touch/pinch zoom state
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [lastWheelTime, setLastWheelTime] = useState(0);
  const [accumulatedDelta, setAccumulatedDelta] = useState(0);

  /**
   * Calculate dynamic canvas dimensions based on content
   * @returns Object with width and height for the canvas
   */
  const calculateCanvasDimensions = useCallback((): { width: number; height: number } => {
    if (members.length === 0) {
      return { width: 1600, height: 1000 };
    }

    const generationGroups: Record<number, FamilyMember[]> = {};
    
    members.forEach(member => {
      if (!generationGroups[member.generation]) {
        generationGroups[member.generation] = [];
      }
      generationGroups[member.generation].push(member);
    });

    // Professional spacing for cleaner bracket connections
    const generationHeight = 450; // Increased for better bracket visibility
    const cardSpacing = 360; // Enhanced spacing between cards
    const padding = 500; // More padding for better framing

    const maxMembersInGeneration = Math.max(
      ...Object.values(generationGroups).map(gen => gen.length)
    );
    const requiredWidth = (maxMembersInGeneration - 1) * cardSpacing + (padding * 2);

    const numberOfGenerations = Object.keys(generationGroups).length;
    const requiredHeight = (numberOfGenerations - 1) * generationHeight + (padding * 2);

    return {
      width: Math.max(2000, requiredWidth), // Increased minimum for professional look
      height: Math.max(1400, requiredHeight)
    };
  }, [members]);

  const canvasDimensions = calculateCanvasDimensions();

  /**
   * Calculate positions for family members with enhanced professional layout
   * @returns Object mapping member IDs to their x,y positions
   */
  const calculateMemberPositions = useCallback((): Record<string, { x: number; y: number }> => {
    const positions: Record<string, { x: number; y: number }> = {};
    
    if (members.length === 0) return positions;

    const generationGroups: Record<number, FamilyMember[]> = {};
    
    members.forEach(member => {
      if (!generationGroups[member.generation]) {
        generationGroups[member.generation] = [];
      }
      generationGroups[member.generation].push(member);
    });

    const centerX = canvasDimensions.width / 2;
    const centerY = canvasDimensions.height / 2;
    
    // Use consistent spacing values matching mockData pattern
    const generationHeight = 450; // Match mockData spacing
    const cardSpacing = 360; // Professional spacing between cards

    // Sort generation keys using proper comparison and compatible method
    const generationKeys = [...Object.keys(generationGroups)]
      .map(Number)
      .sort((a: number, b: number) => a - b);
    const middleGenIndex = Math.floor(generationKeys.length / 2);
    
    generationKeys.forEach((generation: number, indexInArray: number) => {
      const membersInGen = generationGroups[generation];
      
      // Enhanced family grouping for better organization
      const sortedMembers = sortMembersByFamilyGroups(membersInGen);
      
      const totalWidth = (sortedMembers.length - 1) * cardSpacing;
      const relativeGenIndex = indexInArray - middleGenIndex;
      const y = centerY + (relativeGenIndex * generationHeight);
      
      if (sortedMembers.length === 1) {
        positions[sortedMembers[0].id] = { x: centerX, y };
      } else {
        const startX = centerX - (totalWidth / 2);
        
        sortedMembers.forEach((member, memberIndex) => {
          const x = startX + (memberIndex * cardSpacing);
          positions[member.id] = { x, y };
        });
      }
    });

    return positions;
  }, [members, canvasDimensions]);

  // Calculate member positions
  const memberPositions = calculateMemberPositions();

  // Initialize canvas to center position on first load
  useEffect(() => {
    if (canvasRef.current && !isInitialPositionSet && members.length > 0) {
      const rect = canvasRef.current.getBoundingClientRect();
      const viewportCenterX = rect.width / 2;
      const viewportCenterY = rect.height / 2;
      
      const canvasCenterX = canvasDimensions.width / 2;
      const canvasCenterY = canvasDimensions.height / 2;
      
      const zoomScale = viewMode.zoom / 100;
      
      const initialPanOffset = {
        x: viewportCenterX - (canvasCenterX * zoomScale),
        y: viewportCenterY - (canvasCenterY * zoomScale)
      };
      
      setPanOffset(initialPanOffset);
      setIsInitialPositionSet(true);
    }
  }, [isInitialPositionSet, canvasDimensions, viewMode.zoom, members.length]);

  /**
   * Utility function to calculate distance between two touch points
   * @param touches - TouchList from touch event
   * @returns Distance between first two touch points
   */
  const getTouchDistance = (touches: TouchList): number => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  /**
   * Zoom function with boundaries and smooth scaling
   * @param delta - Zoom direction and intensity
   * @param centerX - X coordinate for zoom center
   * @param centerY - Y coordinate for zoom center
   * @param isWheel - Whether zoom is from wheel event
   */
  const handleZoom = useCallback((delta: number, centerX?: number, centerY?: number, isWheel: boolean = false) => {
    const currentZoom = viewMode.zoom;
    
    let zoomSpeed;
    if (isWheel) {
      const zoomFactor = currentZoom / 100;
      zoomSpeed = 0.025 * (1 + zoomFactor * 0.5);
    } else {
      zoomSpeed = 0.12;
    }
    
    const minZoom = 25;
    const maxZoom = 200;
    
    const baseIncrement = currentZoom * zoomSpeed;
    const zoomIncrement = Math.max(0.5, baseIncrement);
    let newZoom = currentZoom + (delta * zoomIncrement);
    
    newZoom = Math.round(newZoom * 2) / 2;
    newZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    
    if (Math.abs(newZoom - currentZoom) >= 0.5) {
      const oldZoomScale = currentZoom / 100.0;
      const newZoomScale = newZoom / 100.0;

      let newPanOffset = panOffset;
      
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        
        let targetXInViewport: number;
        let targetYInViewport: number;

        if (centerX !== undefined && centerY !== undefined) {
          targetXInViewport = centerX - rect.left;
          targetYInViewport = centerY - rect.top;
        } else {
          targetXInViewport = rect.width / 2;
          targetYInViewport = rect.height / 2;
        }
        
        if (oldZoomScale > 0 && newZoomScale > 0) {
          const zoomRatio = newZoomScale / oldZoomScale;
          
          newPanOffset = {
            x: targetXInViewport - (targetXInViewport - panOffset.x) * zoomRatio,
            y: targetYInViewport - (targetYInViewport - panOffset.y) * zoomRatio
          };
        }
      }

      flushSync(() => {
        setViewMode({ zoom: newZoom });
        setPanOffset(newPanOffset);
      });
    }
  }, [viewMode.zoom, setViewMode, panOffset]);

  // Mouse event handlers for panning
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setInitialPanOffset({ ...panOffset });
      e.preventDefault();
    }
  }, [panOffset]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
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

  // Wheel event handler for trackpad zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const currentTime = Date.now();
    const delta = e.deltaY > 0 ? -1 : 1;
    
    if (currentTime - lastWheelTime > 100 || Math.abs(accumulatedDelta) >= 1) {
      handleZoom(delta, e.clientX, e.clientY, true);
      setLastWheelTime(currentTime);
      setAccumulatedDelta(0);
    } else {
      setAccumulatedDelta(prev => prev + delta);
    }
  }, [handleZoom, lastWheelTime, accumulatedDelta]);

  // Touch event handlers for mobile pinch-to-zoom
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setLastTouchDistance(getTouchDistance(e.touches));
      setIsZooming(true);
    } else if (e.touches.length === 1) {
      setIsPanning(true);
      setPanStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setInitialPanOffset({ ...panOffset });
      e.preventDefault();
    }
  }, [panOffset]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isZooming && e.touches.length === 2) {
      e.preventDefault();
      const currentTouchDistance = getTouchDistance(e.touches);
      if (lastTouchDistance === null) return;

      const delta = currentTouchDistance - lastTouchDistance;
      handleZoom(delta * 0.01, (e.touches[0].clientX + e.touches[1].clientX) / 2, (e.touches[0].clientY + e.touches[1].clientY) / 2);
      setLastTouchDistance(currentTouchDistance);
    } else if (isPanning && e.touches.length === 1) {
      e.preventDefault();
      const deltaX = e.touches[0].clientX - panStart.x;
      const deltaY = e.touches[0].clientY - panStart.y;

      setPanOffset({
        x: initialPanOffset.x + deltaX,
        y: initialPanOffset.y + deltaY
      });
    }
  }, [isPanning, isZooming, panStart, initialPanOffset, lastTouchDistance, handleZoom]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (isZooming && e.touches.length < 2) {
      setIsZooming(false);
      setLastTouchDistance(null);
    }
    if (isPanning && e.touches.length < 1) {
      setIsPanning(false);
    }
  }, [isZooming, isPanning]);

  // Keyboard event handler for navigation and zoom
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (editMode && e.key === 'Escape') {
      setEditMode(false);
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setPanOffset(prev => ({ ...prev, y: prev.y + 50 }));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setPanOffset(prev => ({ ...prev, y: prev.y - 50 }));
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setPanOffset(prev => ({ ...prev, x: prev.x + 50 }));
        break;
      case 'ArrowRight':
        e.preventDefault();
        setPanOffset(prev => ({ ...prev, x: prev.x - 50 }));
        break;
      case '+':
      case '=':
        e.preventDefault();
        handleZoom(1);
        break;
      case '-':
        e.preventDefault();
        handleZoom(-1);
        break;
    }
  }, [editMode, setEditMode, handleZoom]);

  // Handle click on canvas to deselect member or exit edit mode
  const handleCanvasClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isMemberCard = target.closest('[data-member-card]');

    if (!isMemberCard && selectedMember) {
      setSelectedMember(null);
    }

    if (editMode && !isMemberCard) {
      setEditMode(false);
    }
  }, [selectedMember, setSelectedMember, editMode, setEditMode]);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
  }, []);

  const handleDragStart = useCallback((e: Event) => {
    e.preventDefault();
  }, []);

  // Filter members based on view settings
  const filteredMembers = members.filter(member => {
    if (!viewMode.showAlive && member.isAlive) return false;
    if (!viewMode.showDeceased && !member.isAlive) return false;
    if (viewMode.selectedGeneration && member.generation !== viewMode.selectedGeneration) return false;
    return true;
  });

  // Add and remove event listeners
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const eventListenerOptions = { passive: false };

    canvasElement.addEventListener('wheel', handleWheel, eventListenerOptions);
    canvasElement.addEventListener('touchstart', handleTouchStart, eventListenerOptions);
    canvasElement.addEventListener('touchmove', handleTouchMove, eventListenerOptions);
    canvasElement.addEventListener('touchend', handleTouchEnd, eventListenerOptions);
    canvasElement.addEventListener('mousedown', handleMouseDown, eventListenerOptions);
    canvasElement.addEventListener('click', handleCanvasClick);
    canvasElement.addEventListener('contextmenu', handleContextMenu, eventListenerOptions);
    canvasElement.addEventListener('dragstart', handleDragStart, eventListenerOptions);

    window.addEventListener('mousemove', handleMouseMove, eventListenerOptions);
    window.addEventListener('mouseup', handleMouseUp, eventListenerOptions);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      canvasElement.removeEventListener('wheel', handleWheel);
      canvasElement.removeEventListener('touchstart', handleTouchStart);
      canvasElement.removeEventListener('touchmove', handleTouchMove);
      canvasElement.removeEventListener('touchend', handleTouchEnd);
      canvasElement.removeEventListener('mousedown', handleMouseDown);
      canvasElement.removeEventListener('click', handleCanvasClick);
      canvasElement.removeEventListener('contextmenu', handleContextMenu);
      canvasElement.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp, handleCanvasClick, handleKeyDown, handleContextMenu, handleDragStart]);

  return (
    <section
      className={`flex-1 bg-gray-50 relative transition-all duration-200 border-0 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
        editMode ? 'bg-blue-25' : ''
      } ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: `${panOffset.x % 20}px ${panOffset.y % 20}px`,
        overflow: 'hidden',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
      aria-label="Family tree canvas - drag to pan, scroll or pinch to zoom, click to interact, use arrow keys to navigate, press Escape to exit edit mode, +/- to zoom"
    >
      <div 
        ref={canvasRef}
        className="absolute inset-0 overflow-hidden"
        style={{ position: 'relative' }}
      >
        <div 
          className="relative"
          style={{
            width: `${canvasDimensions.width}px`,
            height: `${canvasDimensions.height}px`,
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${viewMode.zoom / 100})`,
            transformOrigin: '0 0',
            transition: (isPanning || isZooming || !isInitialPositionSet) ? 'none' : 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform',
          }}
        >
          {/* Family Tree Connections */}
          <FamilyTreeConnections
            members={filteredMembers}
            positions={memberPositions}
            canvasWidth={canvasDimensions.width}
            canvasHeight={canvasDimensions.height}
          />

          {/* Render Member Cards */}
          <div style={{ position: 'relative', zIndex: 10 }} className="pointer-events-auto">
            {filteredMembers.map(member => {
              const position = memberPositions[member.id];
              if (!position) return null;

              return (
                <div key={member.id} data-member-card>
                  {editMode ? (
                    <EditableMemberCard
                      member={member}
                      position={position}
                    />
                  ) : (
                    <MemberCard
                      member={member}
                      position={position}
                      showConnections={true}
                      size="medium"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Generation Labels - Enhanced positioning with consistent spacing */}
          {Object.keys(
            filteredMembers.reduce((acc, member) => {
              acc[member.generation] = true;
              return acc;
            }, {} as Record<number, boolean>)
          ).map(generation => (
            <div
              key={`gen-${generation}`}
              className={`absolute left-12 px-6 py-3 rounded-full shadow-md border text-sm font-semibold transition-all ${
                editMode 
                  ? 'bg-blue-100 border-blue-400 text-blue-900' 
                  : 'bg-white border-gray-400 text-gray-700'
              }`}
              style={{
                top: 250 + ((parseInt(generation) - 1) * 450), // Match consistent spacing
              }}
            >
              Generasi {generation}
            </div>
          ))}

          {/* Enhanced Empty State for new family trees */}
          {(editMode || members.length === 0) && filteredMembers.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
              <div className="text-center p-8 bg-white rounded-lg shadow-lg border-2 border-blue-200">
                <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {members.length === 0 ? 'Pohon Keluarga Kosong' : 'Mode Edit Aktif'}
                </h3>
                <p className="text-gray-600 mb-4">
                  Mulai membangun pohon keluarga dengan menambahkan anggota pertama
                </p>
                <button 
                  onClick={() => {
                    // Trigger add first member - will be handled by UnifiedMemberModal
                    setEditMode(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Tambah Anggota Pertama
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};