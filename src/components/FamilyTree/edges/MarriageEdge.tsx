import React from 'react';
import { EdgeProps } from 'reactflow';

export const MarriageEdge: React.FC<EdgeProps> = ({
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
  // Force horizontal line at same Y level for spouse connections
  const createDirectSpousePath = () => {
    // Use the same Y coordinate for both points to ensure perfectly horizontal line
    const avgY = (sourceY + targetY) / 2;
    return `M ${sourceX} ${avgY} L ${targetX} ${avgY}`;
  };

  const midX = sourceX + (targetX - sourceX) / 2;
  const midY = (sourceY + targetY) / 2; // Use average Y for perfect horizontal

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
      
      {/* Optional marriage indicator */}
      <circle
        cx={midX}
        cy={midY}
        r={6}
        fill="#ef4444"
        stroke="white"
        strokeWidth={2}
        className="react-flow__edge-label"
      />
      
      <text
        x={midX}
        y={midY + 2}
        textAnchor="middle"
        fontSize="8"
        fill="white"
        className="react-flow__edge-label pointer-events-none"
      >
        ♥
      </text>
    </>
  );
};