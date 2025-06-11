import { Node } from 'reactflow';
import { FamilyMember } from '../../../types/family';

export interface TierLayout {
  generation: number;
  y: number;
  members: string[];
}

/**
 * Calculate tier-based layout for family tree
 * Each generation has fixed Y position, nodes can only move horizontally
 * @param nodes - Array of family member nodes to layout
 * @returns Object containing layouted nodes and tier information
 */
export const calculateTierLayout = (
  nodes: Node[]
): { layoutedNodes: Node[]; tiers: TierLayout[] } => {
  const TIER_HEIGHT = 350; // Increased for better bracket spacing
  const NODE_WIDTH = 280; // Wider spacing for cleaner look
  const HORIZONTAL_SPACING = 120; // More space between nodes
  const START_Y = 200; // Better starting position

  // Group nodes by generation
  const generationMap = new Map<number, Node[]>();
  
  nodes.forEach(node => {
    const member = node.data?.member as FamilyMember;
    const generation = member?.generation ?? 0;
    
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
    
    // Enhanced sorting: place spouses directly adjacent and group families
    const sortedNodes = [...nodesInGeneration].sort((a, b) => {
      const memberA = a.data?.member as FamilyMember;
      const memberB = b.data?.member as FamilyMember;
      
      // Group family units together
      const familyGroupA = getFamilyGroupId(memberA);
      const familyGroupB = getFamilyGroupId(memberB);
      
      if (familyGroupA !== familyGroupB) {
        return familyGroupA.localeCompare(familyGroupB);
      }
      
      // Within same family group, spouses should be adjacent
      if (memberA.spouseId === memberB.id) return -1;
      if (memberB.spouseId === memberA.id) return 1;
      
      return memberA.name.localeCompare(memberB.name);
    });
    
    // Calculate optimal spacing for family groups
    const totalWidth = sortedNodes.length * NODE_WIDTH + 
                     (sortedNodes.length - 1) * HORIZONTAL_SPACING;
    const startX = -totalWidth / 2;

    // Position nodes with enhanced family grouping
    sortedNodes.forEach((node, index) => {
      const x = startX + (index * (NODE_WIDTH + HORIZONTAL_SPACING));
      
      layoutedNodes.push({
        ...node,
        position: { x, y },
        data: {
          ...node.data,
          tier: tierIndex,
          generationY: y,
          familyGroup: getFamilyGroupId(node.data?.member),
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

// Helper function to determine family group for better organization
const getFamilyGroupId = (member: FamilyMember | null): string => {
  if (!member) return 'unknown';
  
  // Use parent IDs to group siblings together
  if (member.parentIds && member.parentIds.length > 0) {
    const sortedParentIds = [...member.parentIds].sort((a: string, b: string) => a.localeCompare(b));
    return sortedParentIds.join('-');
  }
  
  // Use spouse relationship for married couples
  if (member.spouseId) {
    const spouseGroup = [member.id, member.spouseId].sort((a: string, b: string) => a.localeCompare(b));
    return spouseGroup.join('-spouse');
  }
  
  return member.id;
};

/**
 * Constrain node movement to horizontal only within its tier
 * @param nodeId - ID of the node being moved
 * @param newPosition - Attempted new position
 * @param tiers - Array of tier layout information
 * @returns Constrained position with fixed Y coordinate
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
