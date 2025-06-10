import React from 'react';
import { EdgeProps } from 'reactflow';

/**
 * MarriageEdge component renders a horizontal connection line between spouses
 * with a heart indicator in the middle to represent marriage relationship
 * 
 * @param props - EdgeProps containing connection coordinates and styling
 * @returns JSX element representing the marriage connection
 */
export const MarriageEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}) => {
  /**
   * Creates a direct horizontal path for spouse connections
   * Uses average Y coordinate to ensure perfectly horizontal line
   * 
   * @returns SVG path string for the marriage connection
   */
  const createDirectSpousePath = (): string => {
    // Use the same Y coordinate for both points to ensure perfectly horizontal line
    const avgY = (sourceY + targetY) / 2;
    return `M ${sourceX} ${avgY} L ${targetX} ${avgY}`;
  };

  /**
   * Calculates the center point for the marriage indicator
   */
  const getConnectionCenter = () => {
    const midX = sourceX + (targetX - sourceX) / 2;
    const midY = (sourceY + targetY) / 2; // Use average Y for perfect horizontal
    return { x: midX, y: midY };
  };

  const { x: centerX, y: centerY } = getConnectionCenter();

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
        d={createDirectSpousePath()}
        markerEnd={markerEnd}
        strokeLinecap="round"
      />
      
      {/* Marriage indicator with heart symbol */}
      <circle
        cx={centerX}
        cy={centerY}
        r={6}
        fill="#ef4444"
        stroke="white"
        strokeWidth={2}
        className="react-flow__edge-label"
      />
      
      <text
        x={centerX}
        y={centerY + 2}
        textAnchor="middle"
        fontSize="8"
        fill="white"
        className="react-flow__edge-label pointer-events-none"
        aria-hidden="true"
      >
        ♥
      </text>
    </>
  );
};