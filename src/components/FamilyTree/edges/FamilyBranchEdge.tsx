import React from 'react';
import { EdgeProps } from 'reactflow';

// interface FamilyBranchEdgeProps extends EdgeProps {
//   // EdgeProps already provide sourceX, sourceY, targetX, targetY
// }

export const FamilyBranchEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}) => {
  // Path: From source (junction) to targetX at sourceY level, then down to targetY
  // This creates the horizontal branch and vertical drop for each child
  const edgePath = `M ${sourceX},${sourceY} L ${targetX},${sourceY} L ${targetX},${targetY}`;

  return (
    <path
      id={id}
      style={{
        ...style,
        stroke: '#cccccc',
        strokeWidth: 2,
        fill: 'none',
      }}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
}; 