import { Node, Edge } from 'reactflow';
import { FamilyMember } from '../../../types/family';

export interface TierLayout {
  generation: number;
  y: number;
  members: string[];
}

/**
 * Calculate tier-based layout for family tree
 * Each generation has fixed Y position, nodes can only move horizontally
 */
export const calculateTierLayout = (
  nodes: Node[],
  edges: Edge[]
): { layoutedNodes: Node[]; tiers: TierLayout[] } => {
  const TIER_HEIGHT = 280;
  const NODE_WIDTH = 250;
  const HORIZONTAL_SPACING = 80;
  const START_Y = 150;

  // Group nodes by generation
  const generationMap = new Map<number, Node[]>();
  
  nodes.forEach(node => {
    const member = node.data?.member as FamilyMember;
    const generation = member?.generation || 0;
    
    if (!generationMap.has(generation)) {
      generationMap.set(generation, []);
    }
    generationMap.get(generation)!.push(node);
  });

  // Sort generations
  const sortedGenerations = Array.from(generationMap.keys()).sort((a, b) => a - b);
  
  const tiers: TierLayout[] = [];
  const layoutedNodes: Node[] = [];

  sortedGenerations.forEach((generation, tierIndex) => {
    const nodesInGeneration = generationMap.get(generation)!;
    const y = START_Y + (tierIndex * TIER_HEIGHT);
    
    // Sort nodes in generation to place spouses next to each other
    const sortedNodes = [...nodesInGeneration].sort((a, b) => {
      const memberA = a.data?.member as FamilyMember;
      const memberB = b.data?.member as FamilyMember;
      
      // If A is spouse of B, put them next to each other
      if (memberA.spouseId === memberB.id) return -1;
      if (memberB.spouseId === memberA.id) return 1;
      
      // Otherwise sort by name
      return memberA.name.localeCompare(memberB.name);
    });
    
    // Calculate spacing to put spouses directly adjacent
    const totalWidth = sortedNodes.length * NODE_WIDTH + 
                     (sortedNodes.length - 1) * HORIZONTAL_SPACING;
    const startX = -totalWidth / 2;

    // Position nodes with spouses adjacent
    sortedNodes.forEach((node, index) => {
      const x = startX + (index * (NODE_WIDTH + HORIZONTAL_SPACING));
      
      layoutedNodes.push({
        ...node,
        position: { x, y }, // Same Y for all nodes in same generation
        data: {
          ...node.data,
          tier: tierIndex,
          generationY: y,
        }
      });
    });

    tiers.push({
      generation,
      y,
      members: sortedNodes.map(n => n.id)
    });
  });

  return { layoutedNodes, tiers };
};

/**
 * Constrain node movement to horizontal only within its tier
 */
export const constrainNodeMovement = (
  nodeId: string,
  newPosition: { x: number; y: number },
  tiers: TierLayout[]
): { x: number; y: number } => {
  // Find which tier this node belongs to
  const tier = tiers.find(t => t.members.includes(nodeId));
  
  if (!tier) {
    return newPosition;
  }

  // Allow horizontal movement but fix Y position
  return {
    x: newPosition.x,
    y: tier.y
  };
};
