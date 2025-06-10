import * as React from 'react';
import { useRef, useState, useCallback, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { EditableMemberCard } from './EditableMemberCard';
import { MemberCard } from './MemberCard';
import { useFamilyStore } from '../../store/familyStore';
import { FamilyMember } from '../../types/family';

export const TreeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { members, viewMode, editMode, setEditMode, setViewMode, selectedMember, setSelectedMember } = useFamilyStore();
  
  // Pan/drag state for canvas navigation
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 }); // Will be calculated dynamically
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [initialPanOffset, setInitialPanOffset] = useState({ x: 0, y: 0 });
  const [isInitialPositionSet, setIsInitialPositionSet] = useState(false);
  
  // Touch/pinch zoom state
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [lastWheelTime, setLastWheelTime] = useState(0);
  const [accumulatedDelta, setAccumulatedDelta] = useState(0);

  // Prevent browser zoom and add global CSS to prevent page movement
  useEffect(() => {
    // Add meta viewport to prevent zoom
    const metaViewport = document.querySelector('meta[name="viewport"]');
    const originalContent = metaViewport?.getAttribute('content') ?? '';
    
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    // Add CSS to prevent page zoom and movement
    const style = document.createElement('style');
    style.id = 'canvas-zoom-prevention';
    style.textContent = `
      html, body {
        touch-action: manipulation !important;
        overscroll-behavior: none !important;
        -webkit-user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      /* Prevent zoom on double tap */
      * {
        touch-action: manipulation !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup on unmount
    return () => {
      if (metaViewport && originalContent) {
        metaViewport.setAttribute('content', originalContent);
      }
      const existingStyle = document.getElementById('canvas-zoom-prevention');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  // Calculate dynamic canvas dimensions based on content
  const calculateCanvasDimensions = useCallback((): { width: number; height: number } => {
    if (members.length === 0) {
      // Minimum canvas size for empty state
      return { width: 800, height: 600 };
    }

    const generationGroups: Record<number, FamilyMember[]> = {};
    
    // Group members by generation
    members.forEach(member => {
      if (!generationGroups[member.generation]) {
        generationGroups[member.generation] = [];
      }
      generationGroups[member.generation].push(member);
    });

    const generationHeight = 350;
    const cardSpacing = 300;
    const padding = 200; // Padding around the entire tree

    // Calculate required width (based on the generation with most members)
    const maxMembersInGeneration = Math.max(
      ...Object.values(generationGroups).map(gen => gen.length)
    );
    const requiredWidth = (maxMembersInGeneration - 1) * cardSpacing + (padding * 2);

    // Calculate required height (based on number of generations)
    const numberOfGenerations = Object.keys(generationGroups).length;
    const requiredHeight = (numberOfGenerations - 1) * generationHeight + (padding * 2);

    // Ensure minimum size
    const minWidth = 800;
    const minHeight = 600;

    return {
      width: Math.max(minWidth, requiredWidth),
      height: Math.max(minHeight, requiredHeight)
    };
  }, [members]);

  // Get dynamic canvas dimensions
  const canvasDimensions = calculateCanvasDimensions();

  // Initialize canvas to center position on first load
  useEffect(() => {
    if (canvasRef.current && !isInitialPositionSet) {
      // Calculate initial position to center the dynamic canvas in viewport
      const rect = canvasRef.current.getBoundingClientRect();
      const viewportCenterX = rect.width / 2;
      const viewportCenterY = rect.height / 2;
      
      // Calculate the center position of dynamic canvas
      const canvasCenterX = canvasDimensions.width / 2;
      const canvasCenterY = canvasDimensions.height / 2;
      
      // Set initial pan offset to center the canvas
      const zoomScale = viewMode.zoom / 100;
      
      const initialPanOffset = {
        x: viewportCenterX - (canvasCenterX * zoomScale),
        y: viewportCenterY - (canvasCenterY * zoomScale)
      };
      
      setPanOffset(initialPanOffset);
      setIsInitialPositionSet(true);
      console.log("Dynamic canvas centered:", canvasDimensions);
    }
  }, [isInitialPositionSet, canvasDimensions, viewMode.zoom]);

  // Calculate positions for family members with dynamic canvas - centered approach
  const calculatePositions = useCallback((): Record<string, { x: number; y: number }> => {
    const positions: Record<string, { x: number; y: number }> = {};
    const generationGroups: Record<number, FamilyMember[]> = {};
    
    // Group members by generation
    members.forEach(member => {
      if (!generationGroups[member.generation]) {
        generationGroups[member.generation] = [];
      }
      generationGroups[member.generation].push(member);
    });

    // Use dynamic canvas center
    const centerX = canvasDimensions.width / 2;
    const centerY = canvasDimensions.height / 2;
    
    const generationHeight = 350;
    const cardSpacing = 300;

    // Get generations and sort them
    const generationKeys = Object.keys(generationGroups).map(Number).sort((a, b) => a - b);
    
    // Calculate how many generations we have above and below the middle
    const middleGenIndex = Math.floor(generationKeys.length / 2);
    
    // Position each generation relative to the center
    generationKeys.forEach((generation, indexInArray) => {
      const membersInGen = generationGroups[generation];
      
      // Calculate total width needed for this generation
      const totalWidth = (membersInGen.length - 1) * cardSpacing;
      
      // Calculate vertical position relative to center
      const relativeGenIndex = indexInArray - middleGenIndex;
      const y = centerY + (relativeGenIndex * generationHeight);
      
      // Center this generation horizontally
      const startX = centerX - (totalWidth / 2);
      
      // Position each member in this generation
      membersInGen.forEach((member, memberIndex) => {
        const x = startX + (memberIndex * cardSpacing);
        positions[member.id] = { x, y };
      });
    });

    return positions;
  }, [members, canvasDimensions]);

  const positions = calculatePositions();

  // Utility function to calculate distance between two touch points
  const getTouchDistance = (touches: TouchList): number => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Zoom function with boundaries - enhanced smoothness
  const handleZoom = useCallback((delta: number, centerX?: number, centerY?: number, isWheel: boolean = false) => {
    const currentZoom = viewMode.zoom;
    
    // Enhanced zoom speeds for ultra-smooth experience
    let zoomSpeed;
    if (isWheel) {
      // More responsive wheel zoom with dynamic scaling
      const zoomFactor = currentZoom / 100;
      zoomSpeed = 0.025 * (1 + zoomFactor * 0.5); // Adaptive speed based on current zoom
    } else {
      // Keyboard and touch zoom
      zoomSpeed = 0.12;
    }
    
    const minZoom = 25;
    const maxZoom = 200;
    
    // Calculate zoom increment with smoother scaling
    const baseIncrement = currentZoom * zoomSpeed;
    const zoomIncrement = Math.max(0.5, baseIncrement); // Allow smaller increments for smoothness
    let newZoom = currentZoom + (delta * zoomIncrement);
    
    // More precise rounding for finer control
    newZoom = Math.round(newZoom * 2) / 2; // Round to nearest 0.5
    newZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    
    // Update with smaller threshold for more responsive zoom
    if (Math.abs(newZoom - currentZoom) >= 0.5) {
      const oldZoomScale = currentZoom / 100.0;
      const newZoomScale = newZoom / 100.0;

      // Calculate new pan offset BEFORE updating zoom to avoid flickering
      let newPanOffset = panOffset;
      
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        
        let targetXInViewport: number;
        let targetYInViewport: number;

        if (centerX !== undefined && centerY !== undefined) {
          // Zoom towards mouse/touch position
          targetXInViewport = centerX - rect.left;
          targetYInViewport = centerY - rect.top;
        } else {
          // Keyboard zoom: zoom towards the center of the viewport
          targetXInViewport = rect.width / 2;
          targetYInViewport = rect.height / 2;
        }
        
        // Calculate new pan offset using current values to prevent flickering
        if (oldZoomScale > 0 && newZoomScale > 0) {
          const zoomRatio = newZoomScale / oldZoomScale;
          
          newPanOffset = {
            x: targetXInViewport - (targetXInViewport - panOffset.x) * zoomRatio,
            y: targetYInViewport - (targetYInViewport - panOffset.y) * zoomRatio
          };
        }
      }

      // Use flushSync for synchronous updates
      flushSync(() => {
        setViewMode({ zoom: newZoom });
        setPanOffset(newPanOffset);
      });
    }
  }, [viewMode.zoom, setViewMode, panOffset]);

  // Mouse event handlers for panning
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button === 0) { // Left mouse button only
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
    
    // Check if enough time has passed or accumulated delta is significant
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
      e.preventDefault(); // Prevent page scroll
      setLastTouchDistance(getTouchDistance(e.touches));
      setIsZooming(true);
    } else if (e.touches.length === 1) {
      setIsPanning(true);
      setPanStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setInitialPanOffset({ ...panOffset });
      e.preventDefault(); // Prevent page scroll during pan
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
    // Check if the click occurred on a member card
    const target = e.target as HTMLElement;
    const isMemberCard = target.closest('.member-card'); // Assuming member cards have a class "member-card"

    if (!isMemberCard && selectedMember) {
      setSelectedMember(null);
    }

    if (editMode) {
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

  // Add and remove event listeners for wheel and touch events to control passive behavior
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    // Options for non-passive event listeners
    const eventListenerOptions = { passive: false };

    canvasElement.addEventListener('wheel', handleWheel, eventListenerOptions);
    canvasElement.addEventListener('touchstart', handleTouchStart, eventListenerOptions);
    canvasElement.addEventListener('touchmove', handleTouchMove, eventListenerOptions);
    canvasElement.addEventListener('touchend', handleTouchEnd, eventListenerOptions);

    // Mouse event listeners
    canvasElement.addEventListener('mousedown', handleMouseDown, eventListenerOptions);
    canvasElement.addEventListener('click', handleCanvasClick);
    canvasElement.addEventListener('contextmenu', handleContextMenu, eventListenerOptions);
    canvasElement.addEventListener('dragstart', handleDragStart, eventListenerOptions);

    // Global listeners
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
        touchAction: 'none', // Prevent default touch behaviors
        userSelect: 'none', // Prevent text selection
        WebkitUserSelect: 'none', // Safari
        WebkitTouchCallout: 'none', // Prevent callout on iOS
        WebkitTapHighlightColor: 'transparent', // Remove tap highlight
      }}
      aria-label="Family tree canvas - drag to pan, scroll or pinch to zoom, click to interact, use arrow keys to navigate, press Escape to exit edit mode, +/- to zoom"
    >
      {/* This div acts as the actual visible viewport for the family tree */}
      <div 
        ref={canvasRef} // Attach ref to this actual viewport div
        className="absolute inset-0 overflow-hidden"
        style={{ position: 'relative' }}
      >
        {/* Large draggable canvas container - now dynamic */}
        <div 
          className="relative pointer-events-none"
          style={{
            width: `${canvasDimensions.width}px`, // Dynamic width
            height: `${canvasDimensions.height}px`, // Dynamic height
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${viewMode.zoom / 100})`,
            transformOrigin: '0 0',
            transition: (isPanning || isZooming || !isInitialPositionSet) ? 'none' : 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform',
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
      </div>
    </section>
  );
};
