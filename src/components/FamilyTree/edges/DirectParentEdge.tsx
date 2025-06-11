import React from 'react';
import { EdgeProps, getStraightPath } from 'reactflow';

/**
 * DirectParentEdge component renders a simple straight connection line between a biological parent and a step-child
 * Uses React Flow's built-in getStraightPath for clean rendering
 * 
 * @param props - EdgeProps containing connection coordinates and styling
 * @returns JSX element representing the direct parent connection
 */
export const DirectParentEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}) => {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <path
      id={id}
      style={{
        ...style,
        stroke: '#cccccc',
        strokeWidth: 2,
        strokeDasharray: '5 5', // Dashed line for step-children
        fill: 'none',
      }}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
}; 