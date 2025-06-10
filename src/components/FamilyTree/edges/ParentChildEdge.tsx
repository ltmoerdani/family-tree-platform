import React from 'react';
import { EdgeProps } from 'reactflow';

export const ParentChildEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  // Create clean tier-based bracket path with better proportions for wider spacing
  const createTierBracketPath = () => {
    const verticalDistance = targetY - sourceY;
    const midY = sourceY + verticalDistance * 0.4; // Adjusted connection point for better bracket look

    return `
      M ${sourceX} ${sourceY}
      L ${sourceX} ${midY}
      L ${targetX} ${midY}
      L ${targetX} ${targetY}
    `;
  };

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
      />

      {/* Tier connection indicator - positioned better for wider spacing */}
      <circle
        cx={sourceX}
        cy={sourceY + (targetY - sourceY) * 0.4}
        r={3} // Slightly larger for better visibility
        fill="#6b7280"
        className="react-flow__edge-label"
      />
    </>
  );
};