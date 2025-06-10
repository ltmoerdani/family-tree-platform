import React from 'react';
import { EdgeProps } from 'reactflow';

export const SiblingEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
}) => {
  // Create bracket-style connection for siblings
  const createSiblingPath = () => {
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
    />
  );
};
