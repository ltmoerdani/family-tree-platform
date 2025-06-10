import React from 'react';
import type { JSX } from 'react';
import { FamilyMember } from '../../types/family';

interface FamilyTreeConnectionsProps {
  members: FamilyMember[];
  positions: Record<string, { x: number; y: number }>;
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * Groups children by their generation for organized connection rendering
 * @param member - Parent member
 * @param members - All family members
 * @param positions - Position data for all members
 * @returns Object mapping generation numbers to child IDs
 */
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

/**
 * Enhanced connection start point with better spouse handling
 */
const calculateEnhancedConnectionStartPoint = (
  memberPos: { x: number; y: number },
  spousePos: { x: number; y: number } | null
) => {
  if (spousePos) {
    // For married couples, connection starts from center point between spouses
    const centerX = (memberPos.x + spousePos.x) / 2;
    const lowerY = Math.max(memberPos.y, spousePos.y) + 120; // Professional spacing
    return { x: centerX, y: lowerY };
  }
  
  // Single parent connection
  return {
    x: memberPos.x,
    y: memberPos.y + 120
  };
};

/**
 * Calculates the bounds and center point for children positioning
 * @param childPositions - Array of child positions
 * @returns Object with bounds and center coordinates
 */
const calculateChildrenBounds = (childPositions: { x: number; y: number }[]) => {
  const leftmost = Math.min(...childPositions.map(pos => pos.x));
  const rightmost = Math.max(...childPositions.map(pos => pos.x));
  const centerX = (leftmost + rightmost) / 2;
  const topY = childPositions[0].y - 96;

  return {
    leftmost,
    rightmost,
    centerX,
    topY
  };
};

/**
 * Create professional bracket-style connection structure
 */
const createProfessionalBracketStructure = (
  startPoint: { x: number; y: number },
  childrenBounds: { leftmost: number; rightmost: number; centerX: number; topY: number },
  generation: string,
  memberId: string,
  childrenCount: number
): JSX.Element[] => {
  const bracketDropDistance = 80; // Professional bracket depth
  const horizontalLineY = startPoint.y + bracketDropDistance;

  const connections = [
    // Main vertical line from parent(s) down
    <line
      key={`parent-main-${memberId}-${generation}`}
      x1={startPoint.x}
      y1={startPoint.y}
      x2={startPoint.x}
      y2={horizontalLineY}
      stroke="#374151"
      strokeWidth="3"
      className="hover:stroke-blue-600 transition-colors duration-200"
      strokeLinecap="round"
    />,
    
    // Horizontal connecting line to children center (if not directly below)
    ...(Math.abs(startPoint.x - childrenBounds.centerX) > 5 ? [
      <line
        key={`horizontal-connector-${memberId}-${generation}`}
        x1={startPoint.x}
        y1={horizontalLineY}
        x2={childrenBounds.centerX}
        y2={horizontalLineY}
        stroke="#374151"
        strokeWidth="3"
        className="hover:stroke-blue-600 transition-colors duration-200"
        strokeLinecap="round"
      />
    ] : []),
    
    // Vertical line down to children bracket level
    <line
      key={`children-vertical-${memberId}-${generation}`}
      x1={childrenBounds.centerX}
      y1={horizontalLineY}
      x2={childrenBounds.centerX}
      y2={childrenBounds.topY}
      stroke="#374151"
      strokeWidth="3"
      className="hover:stroke-blue-600 transition-colors duration-200"
      strokeLinecap="round"
    />
  ];

  // Enhanced horizontal bracket line for multiple children
  if (childrenCount > 1) {
    connections.push(
      <line
        key={`children-bracket-${memberId}-${generation}`}
        x1={childrenBounds.leftmost}
        y1={childrenBounds.topY}
        x2={childrenBounds.rightmost}
        y2={childrenBounds.topY}
        stroke="#374151"
        strokeWidth="3"
        className="hover:stroke-blue-600 transition-colors duration-200"
        strokeLinecap="round"
      />
    );
  }

  return connections;
};

/**
 * Render professional child connection lines
 */
const renderProfessionalChildLines = (
  childIds: string[],
  positions: Record<string, { x: number; y: number }>,
  childrenTopY: number
): JSX.Element[] => {
  return childIds
    .map(childId => {
      const childPos = positions[childId];
      if (!childPos) return null;

      return (
        <line
          key={`child-line-${childId}`}
          x1={childPos.x}
          y1={childrenTopY}
          x2={childPos.x}
          y2={childPos.y - 120} // Professional card spacing
          stroke="#374151"
          strokeWidth="2"
          className="hover:stroke-blue-500 transition-colors duration-200"
          strokeLinecap="round"
        />
      );
    })
    .filter((element): element is JSX.Element => element !== null);
};

/**
 * Enhanced connection dots for better visual clarity
 */
const renderEnhancedConnectionDots = (
  startPoint: { x: number; y: number },
  childrenBounds: { centerX: number; topY: number }
): JSX.Element[] => {
  const horizontalLineY = startPoint.y + 80;

  return [
    // Connection junction dots
    <circle
      key="dot-parent-junction"
      cx={startPoint.x}
      cy={horizontalLineY}
      r="5"
      fill="#374151"
      className="hover:fill-blue-600 transition-colors duration-200"
    />,
    
    ...(Math.abs(startPoint.x - childrenBounds.centerX) > 5 ? [
      <circle
        key="dot-horizontal-junction"
        cx={childrenBounds.centerX}
        cy={horizontalLineY}
        r="5"
        fill="#374151"
        className="hover:fill-blue-600 transition-colors duration-200"
      />
    ] : []),
    
    <circle
      key="dot-children-junction"
      cx={childrenBounds.centerX}
      cy={childrenBounds.topY}
      r="5"
      fill="#374151"
      className="hover:fill-blue-600 transition-colors duration-200"
    />
  ];
};

/**
 * Helper function to process parent-child connections for a single member
 * Enhanced with professional bracket styling
 */
const processParentChildConnectionsForMember = (
  member: FamilyMember,
  members: FamilyMember[],
  positions: Record<string, { x: number; y: number }>
): JSX.Element[] => {
  const connections: JSX.Element[] = [];
  
  if (!member.childrenIds || member.childrenIds.length === 0) return connections;

  const memberPos = positions[member.id];
  if (!memberPos) return connections;

  const spouse = member.spouseId ? members.find(m => m.id === member.spouseId) : null;
  const spousePos = spouse ? positions[spouse.id] : null;
  const childrenByGeneration = groupChildrenByGeneration(member, members, positions);

  Object.entries(childrenByGeneration).forEach(([generation, childIds]) => {
    const childPositions = childIds.map(id => positions[id]).filter(Boolean);
    if (childPositions.length === 0) return;

    // Enhanced connection start point calculation
    const connectionStartPoint = calculateEnhancedConnectionStartPoint(memberPos, spousePos);
    const childrenBounds = calculateChildrenBounds(childPositions);
    
    // Create professional bracket-style connections
    const connectionLines = createProfessionalBracketStructure(
      connectionStartPoint,
      childrenBounds,
      generation,
      member.id,
      childIds.length
    );

    connections.push(
      <g key={`parent-${member.id}-gen-${generation}`} className="family-connection">
        {connectionLines}
        {renderProfessionalChildLines(childIds, positions, childrenBounds.topY)}
        {renderEnhancedConnectionDots(connectionStartPoint, childrenBounds)}
      </g>
    );
  });

  return connections;
};

export const FamilyTreeConnections: React.FC<FamilyTreeConnectionsProps> = ({
  members,
  positions,
  canvasWidth,
  canvasHeight
}) => {
  /**
   * Renders parent-child connection lines with bracket-style layout
   * @returns Array of JSX elements representing parent-child connections
   */
  const renderParentChildConnections = (): JSX.Element[] => {
    const connections: JSX.Element[] = [];

    members.forEach(member => {
      const memberConnections = processParentChildConnectionsForMember(member, members, positions);
      connections.push(...memberConnections);
    });

    return connections;
  };

  /**
   * Professional spouse connection calculation
   */
  const calculateProfessionalSpouseConnection = (
    memberPos: { x: number; y: number },
    spousePos: { x: number; y: number }
  ) => {
    const leftPos = memberPos.x < spousePos.x ? memberPos : spousePos;
    const rightPos = memberPos.x < spousePos.x ? spousePos : memberPos;
    const connectionY = (leftPos.y + rightPos.y) / 2;

    return {
      startX: leftPos.x + 100, // Professional card edge spacing
      endX: rightPos.x - 100,
      centerX: (leftPos.x + rightPos.x) / 2,
      y: connectionY
    };
  };

  /**
   * Professional marriage indicator
   */
  const renderProfessionalMarriageIndicator = (x: number, y: number): JSX.Element[] => [
    <circle
      key="marriage-bg"
      cx={x}
      cy={y}
      r="12"
      fill="#DC2626"
      stroke="white"
      strokeWidth="3"
      className="hover:fill-red-700 transition-colors duration-200"
    />,
    <text
      key="marriage-symbol"
      x={x}
      y={y + 3}
      textAnchor="middle"
      fontSize="14"
      fill="white"
      className="pointer-events-none font-bold"
    >
      ♥
    </text>
  ];

  /**
   * Renders spouse connection lines (horizontal lines with heart indicator)
   * @returns Array of JSX elements representing spouse connections
   */
  const renderSpouseConnections = (): JSX.Element[] => {
    const connections: JSX.Element[] = [];
    const processedPairs = new Set<string>();

    members.forEach(member => {
      if (!member.spouseId || processedPairs.has(`${member.id}-${member.spouseId}`)) return;

      const memberPos = positions[member.id];
      const spousePos = positions[member.spouseId];

      if (!memberPos || !spousePos) return;

      // Mark this pair as processed to avoid duplicate connections
      processedPairs.add(`${member.id}-${member.spouseId}`);
      processedPairs.add(`${member.spouseId}-${member.id}`);

      const connectionData = calculateProfessionalSpouseConnection(memberPos, spousePos);

      connections.push(
        <g key={`spouse-${member.id}-${member.spouseId}`} className="spouse-connection">
          <line
            x1={connectionData.startX}
            y1={connectionData.y}
            x2={connectionData.endX}
            y2={connectionData.y}
            stroke="#DC2626"
            strokeWidth="3"
            className="hover:stroke-red-700 transition-colors duration-200"
            strokeLinecap="round"
          />
          {renderProfessionalMarriageIndicator(connectionData.centerX, connectionData.y)}
        </g>
      );
    });

    return connections;
  };

  /**
   * Groups siblings by their parent combinations
   * @returns Object mapping parent keys to sibling ID arrays
   */
  const groupSiblingsByParents = (): Record<string, string[]> => {
    const siblingGroups: Record<string, string[]> = {};
    
    members.forEach(member => {
      if (!member.parentIds || member.parentIds.length === 0) return;
      
      const sortedParentIds = [...member.parentIds].sort((a: string, b: string) => a.localeCompare(b));
      const parentKey = sortedParentIds.join('-');
      
      if (!siblingGroups[parentKey]) {
        siblingGroups[parentKey] = [];
      }
      siblingGroups[parentKey].push(member.id);
    });

    return siblingGroups;
  };

  /**
   * Gets sorted sibling positions for connection rendering
   * @param siblingIds - Array of sibling member IDs
   * @returns Sorted array of sibling positions
   */
  const getSortedSiblingPositions = (siblingIds: string[]) => {
    return siblingIds
      .map(id => ({ id, pos: positions[id] }))
      .filter(item => item.pos)
      .sort((a, b) => a.pos.x - b.pos.x);
  };

  /**
   * Calculates positioning data for sibling connections
   * @param siblingPositions - Array of sorted sibling positions
   * @returns Connection positioning data
   */
  const calculateSiblingConnectionData = (
    siblingPositions: Array<{ id: string; pos: { x: number; y: number } }>
  ) => {
    const leftmost = siblingPositions[0];
    const rightmost = siblingPositions[siblingPositions.length - 1];
    const connectionY = leftmost.pos.y - 30;

    return {
      leftX: leftmost.pos.x,
      rightX: rightmost.pos.x,
      y: connectionY
    };
  };

  /**
   * Renders the main sibling bracket line
   */
  const renderSiblingBracket = (
    connectionData: { leftX: number; rightX: number; y: number },
    parentKey: string
  ): JSX.Element => (
    <line
      key={`sibling-bracket-${parentKey}`}
      x1={connectionData.leftX}
      y1={connectionData.y}
      x2={connectionData.rightX}
      y2={connectionData.y}
      stroke="#9CA3AF"
      strokeWidth="2"
      strokeDasharray="4,3"
      className="hover:stroke-gray-600 transition-colors"
      strokeLinecap="round"
    />
  );

  /**
   * Renders vertical connectors from bracket to each sibling
   */
  const renderSiblingConnectors = (
    siblingPositions: Array<{ id: string; pos: { x: number; y: number } }>,
    connectionY: number
  ): JSX.Element[] => {
    return siblingPositions.map(({ id, pos }) => (
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
    ));
  };

  /**
   * Renders connection dots for sibling connections
   */
  const renderSiblingDots = (
    siblingPositions: Array<{ id: string; pos: { x: number; y: number } }>,
    connectionY: number
  ): JSX.Element[] => {
    return siblingPositions.map(({ id, pos }) => (
      <circle
        key={`sibling-dot-${id}`}
        cx={pos.x}
        cy={connectionY}
        r="3"
        fill="#9CA3AF"
        className="hover:fill-gray-600 transition-colors"
      />
    ));
  };

  /**
   * Renders sibling connection lines (dashed horizontal lines)
   * @returns Array of JSX elements representing sibling connections
   */
  const renderSiblingConnections = (): JSX.Element[] => {
    const connections: JSX.Element[] = [];
    const processedGroups = new Set<string>();

    const siblingGroups = groupSiblingsByParents();

    Object.entries(siblingGroups).forEach(([parentKey, siblingIds]) => {
      if (siblingIds.length < 2 || processedGroups.has(parentKey)) return;
      
      processedGroups.add(parentKey);
      
      const siblingPositions = getSortedSiblingPositions(siblingIds);
      if (siblingPositions.length < 2) return;

      const connectionData = calculateSiblingConnectionData(siblingPositions);

      connections.push(
        <g key={`siblings-${parentKey}`}>
          {renderSiblingBracket(connectionData, parentKey)}
          {renderSiblingConnectors(siblingPositions, connectionData.y)}
          {renderSiblingDots(siblingPositions, connectionData.y)}
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

        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6B7280" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#6B7280" stopOpacity="1"/>
        </linearGradient>
      </defs>

      {renderParentChildConnections()}
      {renderSpouseConnections()}
      {renderSiblingConnections()}
    </svg>
  );
};