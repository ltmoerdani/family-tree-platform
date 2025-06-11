import React from 'react';
import { EdgeProps, getStraightPath } from 'reactflow';

/**
 * MarriageEdge component renders a simple straight connection line between spouses
 * Uses React Flow's built-in getStraightPath for clean rendering
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
        stroke: '#ef4444',
        strokeWidth: 2,
        fill: 'none',
      }}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
};