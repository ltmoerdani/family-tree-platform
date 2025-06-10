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
    );
  }).filter(Boolean) as JSX.Element[];
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

      const childrenByGeneration = groupChildrenByGeneration(member, members, positions);

      // Render connections for each generation
      Object.entries(childrenByGeneration).forEach(([generation, childIds]) => {
        const generationConnection = renderGenerationConnections(member, generation, childIds, positions);
        if (generationConnection) {
          connections.push(generationConnection);
        }
      });
    });

    return connections;
  };

  const renderMarriageConnections = (): JSX.Element[] => {
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

      // Calculate marriage line position - directly between cards with no gap
      const lineY = Math.min(memberPos.y, spousePos.y);
      const leftX = Math.min(memberPos.x, spousePos.x) + 80; // Start from edge of left card
      const rightX = Math.max(memberPos.x, spousePos.x) - 80; // End at edge of right card

      connections.push(
        <g key={`marriage-${member.id}-${member.spouseId}`}>
          {/* Marriage line with no gap - directly connecting cards */}
          <line
            x1={leftX}
            y1={lineY}
            x2={rightX}
            y2={lineY}
            stroke="#EF4444"
            strokeWidth="4"
            strokeDasharray="8,4"
            className="hover:stroke-red-600 transition-colors"
            strokeLinecap="round"
          />
          
          {/* Marriage symbol in the middle */}
          <circle
            cx={(leftX + rightX) / 2}
            cy={lineY}
            r="10"
            fill="#EF4444"
            className="hover:fill-red-600 transition-colors"
            stroke="white"
            strokeWidth="3"
          />
          <text
            x={(leftX + rightX) / 2}
            y={lineY + 3}
            textAnchor="middle"
            fontSize="12"
            fill="white"
            className="pointer-events-none font-bold"
          >
            ♥
          </text>

          {/* Vertical connectors to each spouse - no gap */}
          <line
            x1={memberPos.x}
            y1={lineY}
            x2={memberPos.x}
            y2={memberPos.y - 96}
            stroke="#EF4444"
            strokeWidth="3"
            className="hover:stroke-red-600 transition-colors"
            strokeLinecap="round"
          />
          <line
            x1={spousePos.x}
            y1={lineY}
            x2={spousePos.x}
            y2={spousePos.y - 96}
            stroke="#EF4444"
            strokeWidth="3"
            className="hover:stroke-red-600 transition-colors"
            strokeLinecap="round"
          />
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

        {/* Gradient for connection lines */}
        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6B7280" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#6B7280" stopOpacity="1"/>
        </linearGradient>

        {/* Marriage line gradient */}
        <linearGradient id="marriageGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#EF4444" stopOpacity="1"/>
        </linearGradient>
      </defs>

      {/* Render all connection types */}
      {renderParentChildConnections()}
      {renderMarriageConnections()}
      {renderSiblingConnections()}
    </svg>
  );
};