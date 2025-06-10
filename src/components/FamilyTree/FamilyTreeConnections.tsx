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
        y2={childPos.y - 80}
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

  // Calculate bracket structure
  const leftmostChild = Math.min(...childPositions.map(pos => pos.x));
  const rightmostChild = Math.max(...childPositions.map(pos => pos.x));
  const childrenCenterX = (leftmostChild + rightmostChild) / 2;
  const childrenY = childPositions[0].y;

  // Vertical line from parent down
  const parentBottomY = memberPos.y + 80; // Card height/2 + margin
  const horizontalLineY = parentBottomY + 40; // Intermediate horizontal line
  const childrenTopY = childrenY - 80; // Card height/2 + margin

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
        strokeWidth="2"
        className="hover:stroke-blue-500 transition-colors"
      />

      {/* Horizontal line connecting to children area */}
      <line
        x1={memberPos.x}
        y1={horizontalLineY}
        x2={childrenCenterX}
        y2={horizontalLineY}
        stroke="#6B7280"
        strokeWidth="2"
        className="hover:stroke-blue-500 transition-colors"
      />

      {/* Vertical line down to children level */}
      <line
        x1={childrenCenterX}
        y1={horizontalLineY}
        x2={childrenCenterX}
        y2={childrenTopY}
        stroke="#6B7280"
        strokeWidth="2"
        className="hover:stroke-blue-500 transition-colors"
      />

      {/* Horizontal bracket line across all children */}
      {childIds.length > 1 && (
        <line
          x1={leftmostChild}
          y1={childrenTopY}
          x2={rightmostChild}
          y2={childrenTopY}
          stroke="#6B7280"
          strokeWidth="2"
          className="hover:stroke-blue-500 transition-colors"
        />
      )}

      {/* Vertical lines down to each child */}
      {renderChildLines(childIds, positions, childrenTopY)}
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

      // Calculate marriage line position (slightly above the cards)
      const lineY = Math.min(memberPos.y, spousePos.y) - 20;
      const leftX = Math.min(memberPos.x, spousePos.x);
      const rightX = Math.max(memberPos.x, spousePos.x);

      connections.push(
        <g key={`marriage-${member.id}-${member.spouseId}`}>
          {/* Marriage line */}
          <line
            x1={leftX}
            y1={lineY}
            x2={rightX}
            y2={lineY}
            stroke="#EF4444"
            strokeWidth="3"
            strokeDasharray="8,4"
            className="hover:stroke-red-600 transition-colors"
          />
          
          {/* Marriage symbol in the middle */}
          <circle
            cx={(leftX + rightX) / 2}
            cy={lineY}
            r="6"
            fill="#EF4444"
            className="hover:fill-red-600 transition-colors"
          />
          <text
            x={(leftX + rightX) / 2}
            y={lineY + 1}
            textAnchor="middle"
            fontSize="8"
            fill="white"
            className="pointer-events-none"
          >
            ♥
          </text>

          {/* Vertical connectors to each spouse */}
          <line
            x1={memberPos.x}
            y1={lineY}
            x2={memberPos.x}
            y2={memberPos.y - 80}
            stroke="#EF4444"
            strokeWidth="2"
            className="hover:stroke-red-600 transition-colors"
          />
          <line
            x1={spousePos.x}
            y1={lineY}
            x2={spousePos.x}
            y2={spousePos.y - 80}
            stroke="#EF4444"
            strokeWidth="2"
            className="hover:stroke-red-600 transition-colors"
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
      const connectionY = leftmost.pos.y - 40; // Above the cards

      connections.push(
        <g key={`siblings-${parentKey}`}>
          {/* Horizontal line connecting all siblings */}
          <line
            x1={leftmost.pos.x}
            y1={connectionY}
            x2={rightmost.pos.x}
            y2={connectionY}
            stroke="#9CA3AF"
            strokeWidth="1"
            strokeDasharray="3,3"
            className="hover:stroke-gray-600 transition-colors"
          />

          {/* Vertical connectors to each sibling */}
          {siblingPositions.map(({ id, pos }) => (
            <line
              key={`sibling-connector-${id}`}
              x1={pos.x}
              y1={connectionY}
              x2={pos.x}
              y2={pos.y - 80}
              stroke="#9CA3AF"
              strokeWidth="1"
              strokeDasharray="3,3"
              className="hover:stroke-gray-600 transition-colors"
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
      </defs>

      {/* Render all connection types */}
      {renderParentChildConnections()}
      {renderMarriageConnections()}
      {renderSiblingConnections()}
    </svg>
  );
};