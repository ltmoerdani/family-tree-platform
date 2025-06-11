import React, { useCallback, useEffect, useState, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Connection,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
  useReactFlow,
  Panel,
  Position,
  BackgroundVariant,
  NodeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { FamilyMember } from '../../types/family';
import { FamilyMemberNode } from './nodes/FamilyMemberNode';
import { MarriageEdge } from './edges/MarriageEdge';
import { ParentChildEdge } from './edges/ParentChildEdge';
import { SiblingEdge } from './edges/SiblingEdge';
import { ExportControls } from './controls/ExportControls';
import { FamilyTreeControls } from './controls/FamilyTreeControls';
import { MemberEditModal } from './modals/MemberEditModal';

// Define custom node and edge types
const nodeTypes: NodeTypes = {
  familyMember: FamilyMemberNode,
};

const edgeTypes: EdgeTypes = {
  marriage: MarriageEdge,
  parentChild: ParentChildEdge,
  sibling: SiblingEdge,
};

// Dagre layout configuration
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 120; // Standard height for React Flow nodes

interface ReactFlowFamilyTreeProps {
  members: FamilyMember[];
  onMemberUpdate?: (member: FamilyMember) => void;
  onMemberAdd?: (member: Partial<FamilyMember>) => void;
  onMemberDelete?: (memberId: string) => void;
}

/**
 * Converts family members to React Flow nodes with proper positioning
 */
const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = 'TB'
): { nodes: Node[]; edges: Edge[] } => {
  const isHorizontal = direction === 'LR';
  
  // Configure dagre for standard React Flow layout
  dagreGraph.setGraph({ 
    rankdir: direction,
    nodesep: 100, // Standard spacing between nodes
    ranksep: 200, // Standard spacing between generations
    marginx: 50,
    marginy: 50,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: layoutedNodes, edges };
};

/**
 * Converts family members to React Flow nodes
 */
const convertMembersToNodes = (members: FamilyMember[]): Node[] => {
  return members.map((member) => ({
    id: member.id,
    type: 'familyMember',
    position: { x: 0, y: 0 }, // Will be set by layout algorithm
    data: {
      member,
      onEdit: () => {
        // Handle edit - will be passed from parent
      },
      onDelete: () => {
        // Handle delete - will be passed from parent
      },
      onAddChild: () => {
        // Handle add child - will be passed from parent
      },
      onAddSpouse: () => {
        // Handle add spouse - will be passed from parent
      },
    },
    draggable: true,
  }));
};

/**
 * Creates edges between family members based on relationships
 * Uses simple React Flow edges without complex bracket styling
 */
const createFamilyEdges = (members: FamilyMember[]): Edge[] => {
  const edges: Edge[] = [];

  members.forEach((member) => {
    // Create simple spouse connections 
    if (member.spouseId) {
      const spouse = members.find(m => m.id === member.spouseId);
      if (spouse && member.id < spouse.id) { // Avoid duplicate edges
        edges.push({
          id: `spouse-${member.id}-${spouse.id}`,
          source: member.id,
          target: spouse.id,
          type: 'marriage',
          data: { relationship: 'spouse' },
        });
      }
    }

    // Create simple parent-child edges
    if (member.parentIds && member.parentIds.length > 0) {
      member.parentIds.forEach((parentId) => {
        edges.push({
          id: `parent-${parentId}-${member.id}`,
          source: parentId,
          target: member.id,
          type: 'parentChild',
          data: { relationship: 'parentChild' },
        });
      });
    }
  });

  return edges;
};

type GridPatternType = 'dots' | 'lines' | 'cross';

const ReactFlowFamilyTreeInner: React.FC<ReactFlowFamilyTreeProps> = ({
  members,
  onMemberUpdate,
  onMemberAdd,
  onMemberDelete,
}) => {
  const { fitView, getNodes, getEdges } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [layoutDirection, setLayoutDirection] = useState<'TB' | 'LR'>('TB');
  const [gridType, setGridType] = useState<GridPatternType>('lines');
  const [showGrid, setShowGrid] = useState(true);

  // Convert members to nodes and edges
  const { initialNodes, initialEdges } = useMemo(() => {
    const rawNodes = convertMembersToNodes(members);
    const rawEdges = createFamilyEdges(members);
    
    // Add event handlers to node data
    const nodesWithHandlers = rawNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onEdit: setEditingMember,
        onDelete: onMemberDelete,
        onAddChild: (parentId: string) => {
          if (onMemberAdd) {
            const parentMember = node.data.member;
            onMemberAdd({
              parentIds: [parentId],
              generation: (parentMember?.generation ?? 0) + 1,
            });
          }
        },
        onAddSpouse: (memberId: string) => {
          if (onMemberAdd) {
            const parentMember = node.data.member;
            onMemberAdd({
              spouseId: memberId,
              generation: parentMember?.generation ?? 0,
            });
          }
        },
      },
    }));

    return {
      initialNodes: nodesWithHandlers,
      initialEdges: rawEdges,
    };
  }, [members, onMemberAdd, onMemberDelete]);

  // Apply standard layout when members change
  useEffect(() => {
    // Use dagre layout for both vertical and horizontal arrangement
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
      layoutDirection
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    setTimeout(() => {
      fitView({ padding: 0.2 });
    }, 100);
  }, [initialNodes, initialEdges, layoutDirection, setNodes, setEdges, fitView]);

  // Standard node change handler
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
  }, [onNodesChange]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleLayoutChange = useCallback((direction: 'TB' | 'LR') => {
    setLayoutDirection(direction);
  }, []);

  const handleAutoLayout = useCallback(() => {
    // Use dagre layout for both vertical and horizontal arrangement
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      getNodes(),
      getEdges(),
      layoutDirection
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    setTimeout(() => {
      fitView({ padding: 0.2 });
    }, 100);
  }, [getNodes, getEdges, layoutDirection, setNodes, setEdges, fitView]);

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 800 });
  }, [fitView]);

  /**
   * Safely converts grid pattern type to BackgroundVariant
   * @param pattern - The grid pattern type
   * @returns Valid BackgroundVariant
   */
  const convertToBackgroundVariant = (pattern: GridPatternType): BackgroundVariant => {
    return pattern as BackgroundVariant;
  };

  // Helper function to get background color for grid
  const getGridBackgroundColor = (variant: BackgroundVariant): string => {
    switch (variant) {
      case 'dots':
        return '#d1d5db';
      case 'cross':
        return '#e5e7eb';
      default:
        return '#e5e7eb';
    }
  };

  // Helper function to get background gap
  const getGridGap = (variant: BackgroundVariant): number => {
    const baseGap = variant === 'lines' ? 25 : 30;
    return baseGap;
  };

  // Helper function to get background size
  const getGridSize = (variant: BackgroundVariant): number => {
    switch (variant) {
      case 'dots':
        return 1;
      case 'cross':
        return 0.5;
      default:
        return 0.5;
    }
  };

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition={undefined} // Remove React Flow attribution
        className="bg-gray-50"
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        snapToGrid={layoutDirection === 'TB'}
        snapGrid={[25, 50]}
        proOptions={{
          hideAttribution: true // Hide React Flow attribution if using Pro
        }}
      >
        {/* Enhanced Background with softer grid pattern */}
        {showGrid && (
          <Background 
            variant={convertToBackgroundVariant(gridType)}
            gap={getGridGap(convertToBackgroundVariant(gridType))}
            size={getGridSize(convertToBackgroundVariant(gridType))}
            color={getGridBackgroundColor(convertToBackgroundVariant(gridType))}
            style={{
              backgroundColor: '#fafafa',
              opacity: 0.4,
            }}
          />
        )}
        
        {/* Major grid lines - much softer with adjusted spacing */}
        {showGrid && gridType === 'lines' && (
          <Background 
            variant={convertToBackgroundVariant('lines')}
            gap={125}
            size={1}
            color="#d1d5db"
            offset={0}
            style={{
              opacity: 0.15,
            }}
          />
        )}

        {/* Controls for zoom, fit view, etc. */}
        <Controls 
          position="bottom-right"
          showInteractive={false}
          className="bg-white border border-gray-300 rounded-lg shadow-lg"
        />

        {/* Minimap for navigation */}
        <MiniMap
          position="bottom-left"
          className="bg-white border border-gray-300 rounded-lg shadow-lg"
          nodeColor={(node) => {
            const member = node.data?.member as FamilyMember;
            if (!member) return '#e5e7eb';
            return member.gender === 'male' ? '#3b82f6' : '#ec4899';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          pannable
          zoomable
        />

        {/* Custom control panels */}
        <Panel position="top-left" className="space-y-2">
          <FamilyTreeControls
            onLayoutChange={handleLayoutChange}
            onAutoLayout={handleAutoLayout}
            onFitView={handleFitView}
            currentLayout={layoutDirection}
            gridType={convertToBackgroundVariant(gridType)}
            showGrid={showGrid}
            onGridTypeChange={(type: BackgroundVariant) => {
              setGridType(type as GridPatternType);
            }}
            onGridToggle={setShowGrid}
          />
        </Panel>

        <Panel position="top-right">
          <ExportControls />
        </Panel>
      </ReactFlow>

      {/* Edit Member Modal */}
      {editingMember && (
        <MemberEditModal
          member={editingMember}
          isOpen={!!editingMember}
          onClose={() => setEditingMember(null)}
          onSave={(updatedMember) => {
            if (onMemberUpdate) {
              onMemberUpdate(updatedMember);
            }
            setEditingMember(null);
          }}
        />
      )}
    </div>
  );
};

export const ReactFlowFamilyTree: React.FC<ReactFlowFamilyTreeProps> = (props) => {
  return (
    <ReactFlowProvider>
      <ReactFlowFamilyTreeInner {...props} />
    </ReactFlowProvider>
  );
};