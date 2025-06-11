import React from 'react';
import { EdgeProps, getSmoothStepPath } from 'reactflow';

/**
 * ParentChildEdge component renders a simple smooth step connection between parent and child nodes
 * Uses React Flow's built-in getSmoothStepPath for clean rendering
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
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: 'bottom',
    targetPosition: 'top',
  });

  return (
    <path
      id={id}
      style={{
        ...style,
        stroke: '#6b7280',
        strokeWidth: 2,
        fill: 'none',
      }}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
};