import * as React from 'react';
import { useRef, useState, useCallback, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { EditableMemberCard } from './EditableMemberCard';
import { MemberCard } from './MemberCard';
import { useFamilyStore } from '../../store/familyStore';
import { FamilyMember } from '../../types/family';

export const TreeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLButtonElement>(null);
  const { members, viewMode, editMode, setEditMode, setViewMode } = useFamilyStore();
  
  // Pan/drag state for canvas navigation
  const [panOffset, setPanOffset] = useState({ x: -1500, y: -300 }); // Start centered on expanded canvas
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [initialPanOffset, setInitialPanOffset] = useState({ x: 0, y: 0 });
  
  // Touch/pinch zoom state
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [lastWheelTime, setLastWheelTime] = useState(0);
  const [accumulatedDelta, setAccumulatedDelta] = useState(0);
  
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

  // Utility function to calculate distance between two touch points
  const getTouchDistance = (touches: React.TouchList): number => {
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

  // Enhanced helper function to detect pinch gesture
  const isPinchGesture = useCallback((e: React.WheelEvent): boolean => {
    // More precise pinch detection
    const hasCtrlKey = e.ctrlKey;
    const isVerticalOnly = e.deltaY !== 0 && e.deltaX === 0;
    const isMixedDelta = e.deltaY !== 0 && e.deltaX !== 0;
    const isSmallMagnitude = Math.abs(e.deltaY) < 120; // Increased threshold for better detection
    
    return hasCtrlKey || 
           (isVerticalOnly && isSmallMagnitude) ||
           (isMixedDelta && isSmallMagnitude) ||
           (Math.abs(e.deltaY) < 80 && Math.abs(e.deltaX) < 80);
  }, []);

  // Wheel event handler for trackpad zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    const now = Date.now();
    if (now - lastWheelTime < 16) return; // Smoother 60fps throttle
    setLastWheelTime(now);
    
    if (isPinchGesture(e)) {
      // Zoom gesture with more granular control
      let delta = e.deltaY > 0 ? -1 : 1;
      const magnitude = Math.abs(e.deltaY);
      
      // More refined sensitivity based on gesture magnitude
      if (magnitude < 2) delta *= 0.2;
      else if (magnitude < 5) delta *= 0.4;
      else if (magnitude < 10) delta *= 0.7;
      else delta *= 1.0;
      
      const newAccumulated = accumulatedDelta + delta;
      setAccumulatedDelta(newAccumulated);
      
      // Lower threshold for more responsive zoom
      if (Math.abs(newAccumulated) >= 0.6) {
        const zoomDirection = newAccumulated > 0 ? 1 : -1;
        handleZoom(zoomDirection, e.clientX, e.clientY, true);
        setAccumulatedDelta(0);
      }
    } else {
      // Pan gesture with smoother movement
      setPanOffset(prev => ({
        x: prev.x - (e.deltaX * 0.5),
        y: prev.y - (e.deltaY * 0.5)
      }));
    }
  }, [handleZoom, lastWheelTime, accumulatedDelta, isPinchGesture]);

  // Touch event handlers for mobile pinch-to-zoom
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Two finger touch - prepare for zoom
      setIsZooming(true);
      setLastTouchDistance(getTouchDistance(e.touches));
      e.preventDefault();
    } else if (e.touches.length === 1) {
      // Single touch - prepare for pan
      const touch = e.touches[0];
      setIsPanning(true);
      setPanStart({ x: touch.clientX, y: touch.clientY });
      setInitialPanOffset({ ...panOffset });
    }
  }, [panOffset]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && isZooming && lastTouchDistance !== null) {
      // Two finger zoom with balanced threshold
      const currentDistance = getTouchDistance(e.touches);
      const distanceDelta = currentDistance - lastTouchDistance;
      
      if (Math.abs(distanceDelta) > 8) { // Balanced threshold - not too sensitive, not too slow
        const zoomDelta = distanceDelta > 0 ? 1 : -1;
        
        // Get center point between two touches
        const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        
        handleZoom(zoomDelta, centerX, centerY);
        setLastTouchDistance(currentDistance);
      }
      e.preventDefault();
    } else if (e.touches.length === 1 && isPanning && !isZooming) {
      // Single touch pan
      const touch = e.touches[0];
      const deltaX = touch.clientX - panStart.x;
      const deltaY = touch.clientY - panStart.y;
      
      setPanOffset({
        x: initialPanOffset.x + deltaX,
        y: initialPanOffset.y + deltaY
      });
      e.preventDefault();
    }
  }, [isZooming, lastTouchDistance, isPanning, panStart, initialPanOffset, handleZoom]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      // All touches ended
      setIsZooming(false);
      setIsPanning(false);
      setLastTouchDistance(null);
    } else if (e.touches.length === 1) {
      // From two touches to one - end zoom, potentially start pan
      setIsZooming(false);
      setLastTouchDistance(null);
      
      if (!isPanning) {
        const touch = e.touches[0];
        setIsPanning(true);
        setPanStart({ x: touch.clientX, y: touch.clientY });
        setInitialPanOffset({ ...panOffset });
      }
    }
  }, [isPanning, panOffset]);

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

  // Handle keyboard events for accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        if (editMode) {
          setEditMode(false);
          e.preventDefault();
        }
        break;
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

  // Filter members based on view settings
  const filteredMembers = members.filter(member => {
    if (!viewMode.showAlive && member.isAlive) return false;
    if (!viewMode.showDeceased && !member.isAlive) return false;
    if (viewMode.selectedGeneration && member.generation !== viewMode.selectedGeneration) return false;
    return true;
  });

  return (
    <button 
      ref={canvasRef}
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
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleCanvasClick}
      onKeyDown={handleKeyDown}
      aria-label="Family tree canvas - drag to pan, scroll or pinch to zoom, click to interact, use arrow keys to navigate, press Escape to exit edit mode, +/- to zoom"
    >
      {/* Large draggable canvas container */}
      <div 
        className="relative pointer-events-none"
        style={{
          width: '5000px', // Much wider canvas
          height: '4000px', // Much taller canvas
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${viewMode.zoom / 100})`,
          transformOrigin: '0 0', // Keep at top-left for predictable behavior
          transition: isPanning || isZooming ? 'none' : 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth transition when not actively interacting
          willChange: 'transform', // Optimize for transform changes
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
    </button>
  );
};
