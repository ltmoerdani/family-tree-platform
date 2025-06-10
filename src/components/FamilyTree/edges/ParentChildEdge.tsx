import React from 'react';
import { EdgeProps } from 'reactflow';

/**
 * ParentChildEdge component renders a bracket-style connection between parent and child nodes
 * Uses tier-based layout with clean bracket paths for better visual hierarchy
 *
 * @param props - EdgeProps containing connection coordinates and styling
 * @returns JSX element representing the parent-child connection
 */
export const ParentChildEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}) => {
  /**
   * Creates a clean tier-based bracket path with better proportions for wider spacing
   * Connects parent node to child node with a professional bracket-style layout
   *
   * @returns SVG path string for the parent-child bracket connection
   */
  const createTierBracketPath = (): string => {
    const verticalDistance = targetY - sourceY;
    const midY = sourceY + verticalDistance * 0.4; // Adjusted connection point for better bracket look

    return `
      M ${sourceX} ${sourceY}
      L ${sourceX} ${midY}
      L ${targetX} ${midY}
      L ${targetX} ${targetY}
    `;
  };

  /**
   * Calculates the connection indicator position for better visual clarity
   *
   * @returns Object with x and y coordinates for the connection dot
   */
  const getConnectionIndicatorPosition = () => {
    const verticalDistance = targetY - sourceY;
    return {
      x: sourceX,
      y: sourceY + verticalDistance * 0.4,
    };
  };

  const indicatorPosition = getConnectionIndicatorPosition();

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          stroke: '#6b7280',
          strokeWidth: 2,
          fill: 'none',
        }}
        className="react-flow__edge-path"
        d={createTierBracketPath()}
        markerEnd={markerEnd}
        strokeLinecap="round"
      />

      {/* Tier connection indicator - positioned better for wider spacing */}
      <circle
        cx={indicatorPosition.x}
        cy={indicatorPosition.y}
        r={3} // Slightly larger for better visibility
        fill="#6b7280"
        className="react-flow__edge-label hover:fill-blue-500 transition-colors"
      />
    </>
  );
};