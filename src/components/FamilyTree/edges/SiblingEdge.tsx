import React from 'react';
import { EdgeProps } from 'reactflow';

/**
 * SiblingEdge component renders a bracket-style connection between siblings
 * Uses dashed lines to distinguish from parent-child relationships
 *
 * @param props - EdgeProps containing connection coordinates and styling
 * @returns JSX element representing the sibling connection
 */
export const SiblingEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
}) => {
  /**
   * Creates a bracket-style path for sibling connections
   * Connects siblings with a horizontal line above both nodes
   *
   * @returns SVG path string for the sibling bracket
   */
  const createSiblingPath = (): string => {
    const midY = Math.min(sourceY, targetY) - 30; // Above both nodes

    return `
      M ${sourceX} ${sourceY}
      L ${sourceX} ${midY}
      L ${targetX} ${midY}
      L ${targetX} ${targetY}
    `;
  };

  return (
    <path
      id={id}
      style={{
        ...style,
        stroke: '#9ca3af',
        strokeWidth: 1,
        strokeDasharray: '4,2',
        fill: 'none',
      }}
      className="react-flow__edge-path"
      d={createSiblingPath()}
      strokeLinecap="round"
    />
  );
};
