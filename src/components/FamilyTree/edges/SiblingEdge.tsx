import React from 'react';
import { EdgeProps, getSmoothStepPath } from 'reactflow';

/**
 * SiblingEdge component renders a simple smooth step connection between siblings
 * Uses React Flow's built-in getSmoothStepPath with dashed lines
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
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: 'right',
    targetPosition: 'left',
  });

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
      d={edgePath}
      strokeLinecap="round"
    />
  );
};
