import React from 'react';
import type { JSX } from 'react';
import { FamilyMember } from '../../types/family';

interface FamilyTreeConnectionsProps {
  members: FamilyMember[];
  positions: Record<string, { x: number; y: number }>;
  canvasWidth: number;
  canvasHeight: number;
}

// Helper functions to reduce nesting complexity
const groupChildrenByGeneration = (
  member: FamilyMember,
  members: FamilyMember[],
  positions: Record<string, { x: number; y: number }>
): Record<number, string[]> => {
  const childrenByGeneration: Record<number, string[]> = {};
  
  if (!member.childrenIds) return childrenByGeneration;
  
  member.childrenIds.forEach(childId => {
    const child = members.find(m => m.id === childId);
    if (child && positions[childId]) {
      if (!childrenByGeneration[child.generation]) {
        childrenByGeneration[child.generation] = [];
      }
      childrenByGeneration[child.generation].push(childId);
    }
  });
  
  return childrenByGeneration;
};

const renderChildLines = (
  childIds: string[],
  positions: Record<string, { x: number; y: number }>,
  childrenTopY: number
): JSX.Element[] => {
  return childIds.map(childId => {
    const childPos = positions[childId];
    if (!childPos) return null;

    return (
      <line
        key={`child-${childId}`}
        x1={childPos.x}
        y1={childrenTopY}
        x2={childPos.x}
        y2={childPos.y - 96} // Card height/2 + margin
        stroke="#6B7280"
        strokeWidth="2"
        className="hover:stroke-blue-500 transition-colors"
      />
    ).filter(Boolean) as JSX.Element[];
};

const renderGenerationConnections = (
  member: FamilyMember,
  generation: string,
  childIds: string[],
  positions: Record<string, { x: number; y: number }>
): JSX.Element | null => {
  const memberPos = positions[member.id];
  if (!memberPos || childIds.length === 0) return null;

  const childPositions = childIds.map(id => positions[id]).filter(Boolean);
  if (childPositions.length === 0) return null;

  // Calculate improved bracket structure
  const leftmostChild = Math.min(...childPositions.map(pos => pos.x));
  const rightmostChild = Math.max(...childPositions.map(pos => pos.x));
  const childrenCenterX = (leftmostChild + rightmostChild) / 2;
  const childrenY = childPositions[0].y;

  // Improved positioning for cleaner lines
  const parentBottomY = memberPos.y + 96; // Card height/2 + margin
  const horizontalLineY = parentBottomY + 40; // Reduced gap for tighter connections
  const childrenTopY = childrenY - 96; // Card height/2 + margin

  const connectionId = `parent-${member.id}-gen-${generation}`;

  return (
    <g key={connectionId}>
      {/* Vertical line from parent down */}
      <line
        x1={memberPos.x}
        y1={parentBottomY}
        x2={memberPos.x}
        y2={horizontalLineY}
        stroke="#6B7280"
        strokeWidth="3"
        className="hover:stroke-blue-500 transition-colors"
        strokeLinecap="round"
      />

      {/* Horizontal line connecting to children area */}
      <line
        x1={memberPos.x}
        y1={horizontalLineY}
        x2={childrenCenterX}
        y2={horizontalLineY}
        stroke="#6B7280"
        strokeWidth="3"
        className="hover:stroke-blue-500 transition-colors"
        strokeLinecap="round"
      />

      {/* Vertical line down to children level */}
      <line
        x1={childrenCenterX}
        y1={horizontalLineY}
        x2={childrenCenterX}
        y2={childrenTopY}
        stroke="#6B7280"
        strokeWidth="3"
        className="hover:stroke-blue-500 transition-colors"
        strokeLinecap="round"
      />

      {/* Horizontal bracket line across all children */}
      {childIds.length > 1 && (
        <line
          x1={leftmostChild}
          y1={childrenTopY}
          x2={rightmostChild}
          y2={childrenTopY}
          stroke="#6B7280"
          strokeWidth="3"
          className="hover:stroke-blue-500 transition-colors"
          strokeLinecap="round"
        />
      )}

      {/* Vertical lines down to each child */}
      {renderChildLines(childIds, positions, childrenTopY)}

      {/* Connection dots for better visual clarity */}
      <circle
        cx={memberPos.x}
        cy={horizontalLineY}
        r="4"
        fill="#6B7280"
        className="hover:fill-blue-500 transition-colors"
      />
      <circle
        cx={childrenCenterX}
        cy={horizontalLineY}
        r="4"
        fill="#6B7280"
        className="hover:fill-blue-500 transition-colors"
      />
      <circle
        cx={childrenCenterX}
        cy={childrenTopY}
        r="4"
        fill="#6B7280"
        className="hover:fill-blue-500 transition-colors"
      />
    </g>
  );
};

export const FamilyTreeConnections: React.FC<FamilyTreeConnectionsProps> = ({
  members,
  positions,
  canvasWidth,
  canvasHeight
}) => {
  const renderParentChildConnections = (): JSX.Element[] => {
    const connections: JSX.Element[] = [];

    members.forEach(member => {
      if (!member.childrenIds || member.childrenIds.length === 0) return;

      const memberPos = positions[member.id];
      if (!memberPos) return;

      // Check if member has spouse for determining connection start point
      const spouse = member.spouseId ? members.find(m => m.id === member.spouseId) : null;
      const spousePos = spouse ? positions[spouse.id] : null;

      const childrenByGeneration = groupChildrenByGeneration(member, members, positions);

      Object.entries(childrenByGeneration).forEach(([generation, childIds]) => {
        const childPositions = childIds.map(id => positions[id]).filter(Boolean);
        if (childPositions.length === 0) return;

        // Calculate connection start point
        let connectionStartX: number;
        let connectionStartY: number;

        if (spousePos) {
          // If married, start from center between spouses
          connectionStartX = (memberPos.x + spousePos.x) / 2;
          connectionStartY = Math.max(memberPos.y, spousePos.y) + 96; // Bottom of lower card
        } else {
          // Single parent - start from member
          connectionStartX = memberPos.x;
          connectionStartY = memberPos.y + 96; // Bottom of card
        }

        const leftmostChild = Math.min(...childPositions.map(pos => pos.x));
        const rightmostChild = Math.max(...childPositions.map(pos => pos.x));
        const childrenCenterX = (leftmostChild + rightmostChild) / 2;
        const childrenY = childPositions[0].y;
        const childrenTopY = childrenY - 96; // Top of child cards

        // Connection structure - simpler without marriage lines
        const horizontalLineY = connectionStartY + 60; // Connection level

        connections.push(
          <g key={`parent-${member.id}-gen-${generation}`}>
            {/* Vertical line down from parent(s) */}
            <line
              x1={connectionStartX}
              y1={connectionStartY}
              x2={connectionStartX}
              y2={horizontalLineY}
              stroke="#6B7280"
              strokeWidth="3"
              className="hover:stroke-blue-500 transition-colors"
              strokeLinecap="round"
            />

            {/* Horizontal line to children center */}
            <line
              x1={connectionStartX}
              y1={horizontalLineY}
              x2={childrenCenterX}
              y2={horizontalLineY}
              stroke="#6B7280"
              strokeWidth="3"
              className="hover:stroke-blue-500 transition-colors"
              strokeLinecap="round"
            />

            {/* Vertical line down to children level */}
            <line
              x1={childrenCenterX}
              y1={horizontalLineY}
              x2={childrenCenterX}
              y2={childrenTopY}
              stroke="#6B7280"
              strokeWidth="3"
              className="hover:stroke-blue-500 transition-colors"
              strokeLinecap="round"
            />

            {/* Horizontal bracket line across all children */}
            {childIds.length > 1 && (
              <line
                x1={leftmostChild}
                y1={childrenTopY}
                x2={rightmostChild}
                y2={childrenTopY}
                stroke="#6B7280"
                strokeWidth="3"
                className="hover:stroke-blue-500 transition-colors"
                strokeLinecap="round"
              />
            )}

            {/* Vertical lines down to each child */}
            {childIds.map(childId => {
              const childPos = positions[childId];
              if (!childPos) return null;

              return (
                <line
                  key={`child-${childId}`}
                  x1={childPos.x}
                  y1={childrenTopY}
                  x2={childPos.x}
                  y2={childPos.y - 96} // Top of child card
                  stroke="#6B7280"
                  strokeWidth="2"
                  className="hover:stroke-blue-500 transition-colors"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Connection dots for better visual clarity */}
            <circle
              cx={connectionStartX}
              cy={horizontalLineY}
              r="4"
              fill="#6B7280"
              className="hover:fill-blue-500 transition-colors"
            />
            <circle
              cx={childrenCenterX}
              cy={horizontalLineY}
              r="4"
              fill="#6B7280"
              className="hover:fill-blue-500 transition-colors"
            />
            <circle
              cx={childrenCenterX}
              cy={childrenTopY}
              r="4"
              fill="#6B7280"
              className="hover:fill-blue-500 transition-colors"
            />
          </g>
        );
      });
    });

    return connections;
  };

  const renderSpouseConnections = (): JSX.Element[] => {
    const connections: JSX.Element[] = [];
    const processedPairs = new Set<string>();

    members.forEach(member => {
      if (!member.spouseId || processedPairs.has(`${member.id}-${member.spouseId}`)) return;

      const memberPos = positions[member.id];
      const spousePos = positions[member.spouseId];

      if (!memberPos || !spousePos) return;

      // Mark this pair as processed
      processedPairs.add(`${member.id}-${member.spouseId}`);
      processedPairs.add(`${member.spouseId}-${member.id}`);

      // Direct horizontal line between spouses - at the same Y level (center of cards)
      const leftPos = memberPos.x < spousePos.x ? memberPos : spousePos;
      const rightPos = memberPos.x < spousePos.x ? spousePos : memberPos;
      
      // Use the same Y coordinate (center of both cards)
      const connectionY = (leftPos.y + rightPos.y) / 2; // Average Y position if slightly different

      connections.push(
        <g key={`spouse-${member.id}-${member.spouseId}`}>
          {/* Direct horizontal connection line between spouses */}
          <line
            x1={leftPos.x + 80} // From right edge of left card (assuming card width ~160px)
            y1={connectionY}
            x2={rightPos.x - 80} // To left edge of right card
            y2={connectionY}
            stroke="#6B7280"
            strokeWidth="2"
            className="hover:stroke-blue-500 transition-colors"
            strokeLinecap="round"
          />

          {/* Optional: Small heart icon in the middle to indicate marriage */}
          <circle
            cx={(leftPos.x + rightPos.x) / 2}
            cy={connectionY}
            r="8"
            fill="#EF4444"
            stroke="white"
            strokeWidth="2"
            className="hover:fill-red-600 transition-colors"
          />
          <text
            x={(leftPos.x + rightPos.x) / 2}
            y={connectionY + 2}
            textAnchor="middle"
            fontSize="10"
            fill="white"
            className="pointer-events-none font-bold"
          >
            ♥
          </text>
        </g>
      );
    });

    return connections;
  };

  const renderSiblingConnections = (): JSX.Element[] => {
    const connections: JSX.Element[] = [];
    const processedGroups = new Set<string>();

    // Group siblings by their parents
    const siblingGroups: Record<string, string[]> = {};
    
    members.forEach(member => {
      if (!member.parentIds || member.parentIds.length === 0) return;
      
      // Create sorted parent key to avoid mutation
      const sortedParentIds = [...member.parentIds].sort((a, b) => a.localeCompare(b));
      const parentKey = sortedParentIds.join('-');
      
      if (!siblingGroups[parentKey]) {
        siblingGroups[parentKey] = [];
      }
      siblingGroups[parentKey].push(member.id);
    });

    // Render connections for each sibling group
    Object.entries(siblingGroups).forEach(([parentKey, siblingIds]) => {
      if (siblingIds.length < 2 || processedGroups.has(parentKey)) return;
      
      processedGroups.add(parentKey);
      
      const siblingPositions = siblingIds
        .map(id => ({ id, pos: positions[id] }))
        .filter(item => item.pos)
        .sort((a, b) => a.pos.x - b.pos.x);

      if (siblingPositions.length < 2) return;

      const leftmost = siblingPositions[0];
      const rightmost = siblingPositions[siblingPositions.length - 1];
      const connectionY = leftmost.pos.y - 30; // Closer to cards

      connections.push(
        <g key={`siblings-${parentKey}`}>
          {/* Horizontal line connecting all siblings */}
          <line
            x1={leftmost.pos.x}
            y1={connectionY}
            x2={rightmost.pos.x}
            y2={connectionY}
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeDasharray="4,3"
            className="hover:stroke-gray-600 transition-colors"
            strokeLinecap="round"
          />

          {/* Vertical connectors to each sibling - no gap */}
          {siblingPositions.map(({ id, pos }) => (
            <line
              key={`sibling-connector-${id}`}
              x1={pos.x}
              y1={connectionY}
              x2={pos.x}
              y2={pos.y - 96}
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeDasharray="4,3"
              className="hover:stroke-gray-600 transition-colors"
              strokeLinecap="round"
            />
          ))}

          {/* Connection dots */}
          {siblingPositions.map(({ id, pos }) => (
            <circle
              key={`sibling-dot-${id}`}
              cx={pos.x}
              cy={connectionY}
              r="3"
              fill="#9CA3AF"
              className="hover:fill-gray-600 transition-colors"
            />
          ))}
        </g>
      );
    });

    return connections;
  };

  return (
    <svg 
      className="absolute inset-0 pointer-events-none"
      style={{ 
        width: canvasWidth, 
        height: canvasHeight,
        zIndex: 1
      }}
    >
      <defs>
        {/* Arrow marker for parent-child relationships */}
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#6B7280"
          />
        </marker>

        {/* Simplified gradient for connection lines */}
        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6B7280" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#6B7280" stopOpacity="1"/>
        </linearGradient>
      </defs>

      {/* Render simplified connection types */}
      {renderParentChildConnections()}
      {renderSpouseConnections()}
      {renderSiblingConnections()}
    </svg>
  );
};