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
 * Renders vertical lines from children bracket to individual child cards
 * @param childIds - Array of child member IDs
 * @param positions - Position data for all members
 * @param childrenTopY - Y coordinate of the children connection bracket
 * @returns Array of JSX line elements
 */
const renderChildLines = (
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
    })
    .filter((element): element is JSX.Element => element !== null);
};

/**
 * Calculates the starting point for parent-child connections
 * @param memberPos - Position of the parent member
 * @param spousePos - Position of the spouse (if any)
 * @returns Connection start coordinates and Y position
 */
const calculateConnectionStartPoint = (
  memberPos: { x: number; y: number },
  spousePos: { x: number; y: number } | null
) => {
  if (spousePos) {
    return {
      x: (memberPos.x + spousePos.x) / 2,
      y: Math.max(memberPos.y, spousePos.y) + 96
    };
  }
  return {
    x: memberPos.x,
    y: memberPos.y + 96
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
 * Creates the main connection structure (vertical and horizontal lines)
 * @param startPoint - Connection starting point
 * @param childrenBounds - Children positioning bounds
 * @param generation - Generation number
 * @param memberId - Parent member ID
 * @returns JSX elements for connection lines
 */
const createConnectionStructure = (
  startPoint: { x: number; y: number },
  childrenBounds: { leftmost: number; rightmost: number; centerX: number; topY: number },
  generation: string,
  memberId: string
): JSX.Element[] => {
  const horizontalLineY = startPoint.y + 60;

  return [
    // Vertical line from parent down
    <line
      key={`parent-down-${memberId}-${generation}`}
      x1={startPoint.x}
      y1={startPoint.y}
      x2={startPoint.x}
      y2={horizontalLineY}
      stroke="#6B7280"
      strokeWidth="3"
      className="hover:stroke-blue-500 transition-colors"
      strokeLinecap="round"
    />,
    // Horizontal line to children center
    <line
      key={`horizontal-${memberId}-${generation}`}
      x1={startPoint.x}
      y1={horizontalLineY}
      x2={childrenBounds.centerX}
      y2={horizontalLineY}
      stroke="#6B7280"
      strokeWidth="3"
      className="hover:stroke-blue-500 transition-colors"
      strokeLinecap="round"
    />,
    // Vertical line down to children level
    <line
      key={`children-down-${memberId}-${generation}`}
      x1={childrenBounds.centerX}
      y1={horizontalLineY}
      x2={childrenBounds.centerX}
      y2={childrenBounds.topY}
      stroke="#6B7280"
      strokeWidth="3"
      className="hover:stroke-blue-500 transition-colors"
      strokeLinecap="round"
    />,
    // Horizontal bracket line across all children (if multiple)
    ...(childrenBounds.leftmost !== childrenBounds.rightmost ? [
      <line
        key={`bracket-${memberId}-${generation}`}
        x1={childrenBounds.leftmost}
        y1={childrenBounds.topY}
        x2={childrenBounds.rightmost}
        y2={childrenBounds.topY}
        stroke="#6B7280"
        strokeWidth="3"
        className="hover:stroke-blue-500 transition-colors"
        strokeLinecap="round"
      />
    ] : [])
  ];
};

/**
 * Renders connection dots for visual clarity
 * @param startPoint - Connection starting point
 * @param childrenBounds - Children positioning bounds
 * @returns JSX elements for connection dots
 */
const renderConnectionDots = (
  startPoint: { x: number; y: number },
  childrenBounds: { centerX: number; topY: number }
): JSX.Element[] => {
  const horizontalLineY = startPoint.y + 60;

  return [
    <circle
      key="dot-start"
      cx={startPoint.x}
      cy={horizontalLineY}
      r="4"
      fill="#6B7280"
      className="hover:fill-blue-500 transition-colors"
    />,
    <circle
      key="dot-center"
      cx={childrenBounds.centerX}
      cy={horizontalLineY}
      r="4"
      fill="#6B7280"
      className="hover:fill-blue-500 transition-colors"
    />,
    <circle
      key="dot-children"
      cx={childrenBounds.centerX}
      cy={childrenBounds.topY}
      r="4"
      fill="#6B7280"
      className="hover:fill-blue-500 transition-colors"
    />
  ];
};

/**
 * Helper function to process parent-child connections for a single member
 * @param member - The parent member
 * @param members - All family members
 * @param positions - Position data for all members
 * @returns Array of connection JSX elements
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

    const connectionStartPoint = calculateConnectionStartPoint(memberPos, spousePos);
    const childrenBounds = calculateChildrenBounds(childPositions);
    const connectionLines = createConnectionStructure(
      connectionStartPoint,
      childrenBounds,
      generation,
      member.id
    );

    connections.push(
      <g key={`parent-${member.id}-gen-${generation}`}>
        {connectionLines}
        {renderChildLines(childIds, positions, childrenBounds.topY)}
        {renderConnectionDots(connectionStartPoint, childrenBounds)}
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

      const connectionData = calculateSpouseConnectionData(memberPos, spousePos);

      connections.push(
        <g key={`spouse-${member.id}-${member.spouseId}`}>
          <line
            x1={connectionData.startX}
            y1={connectionData.y}
            x2={connectionData.endX}
            y2={connectionData.y}
            stroke="#6B7280"
            strokeWidth="2"
            className="hover:stroke-blue-500 transition-colors"
            strokeLinecap="round"
          />
          {renderMarriageIndicator(connectionData.centerX, connectionData.y)}
        </g>
      );
    });

    return connections;
  };

  /**
   * Calculates spouse connection positioning data
   * @param memberPos - Position of first spouse
   * @param spousePos - Position of second spouse
   * @returns Connection positioning data
   */
  const calculateSpouseConnectionData = (
    memberPos: { x: number; y: number },
    spousePos: { x: number; y: number }
  ) => {
    const leftPos = memberPos.x < spousePos.x ? memberPos : spousePos;
    const rightPos = memberPos.x < spousePos.x ? spousePos : memberPos;
    const connectionY = (leftPos.y + rightPos.y) / 2;

    return {
      startX: leftPos.x + 80,
      endX: rightPos.x - 80,
      centerX: (leftPos.x + rightPos.x) / 2,
      y: connectionY
    };
  };

  /**
   * Renders marriage indicator (heart icon)
   * @param x - X coordinate for the indicator
   * @param y - Y coordinate for the indicator
   * @returns JSX elements for marriage indicator
   */
  const renderMarriageIndicator = (x: number, y: number): JSX.Element[] => [
    <circle
      key="heart-bg"
      cx={x}
      cy={y}
      r="8"
      fill="#EF4444"
      stroke="white"
      strokeWidth="2"
      className="hover:fill-red-600 transition-colors"
    />,
    <text
      key="heart-icon"
      x={x}
      y={y + 2}
      textAnchor="middle"
      fontSize="10"
      fill="white"
      className="pointer-events-none font-bold"
    >
      ♥
    </text>
  ];

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

  /**
   * Groups siblings by their parent combinations
   * @returns Object mapping parent keys to sibling ID arrays
   */
  const groupSiblingsByParents = (): Record<string, string[]> => {
    const siblingGroups: Record<string, string[]> = {};
    
    members.forEach(member => {
      if (!member.parentIds || member.parentIds.length === 0) return;
      
      const sortedParentIds = [...member.parentIds].sort((a, b) => a.localeCompare(b));
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