# Tier Mode Horizontal Handles Implementation

## Overview
Implementasi perubahan arah garis pasangan dalam tier mode untuk menggunakan handle horizontal (kiri-kanan) alih-alih vertikal (atas-bawah).

## Problem Statement
Dalam tier mode (Hierarki Vertikal), garis pasangan atau pernikahan mengambil titik koneksi dari atas/bawah card yang terlihat tidak natural. Seharusnya garis pasangan menggunakan titik koneksi dari sisi kiri dan kanan card.

## Solution Implementation

### 1. Enhanced Edge Creation Logic
**File:** `src/components/FamilyTree/ReactFlowFamilyTree.tsx`

Modifikasi fungsi `createFamilyEdges` untuk mendukung parameter `isTierMode`:

```typescript
const createFamilyEdges = (members: FamilyMember[], isTierMode: boolean = false): Edge[] => {
  const edges: Edge[] = [];

  members.forEach((member) => {
    // Create spouse connections with appropriate handles for tier mode
    if (member.spouseId) {
      const spouse = members.find(m => m.id === member.spouseId);
      if (spouse && member.id < spouse.id) {
        edges.push({
          id: `spouse-${member.id}-${spouse.id}`,
          source: member.id,
          target: spouse.id,
          type: 'marriage',
          // In tier mode, use horizontal handles (left/right)
          // In free layout, use vertical handles (top/bottom) 
          sourceHandle: isTierMode ? 'right' : 'bottom',
          targetHandle: isTierMode ? 'left' : 'top',
          data: { relationship: 'spouse' },
        });
      }
    }

    // Create parent-child edges (always vertical regardless of mode)
    if (member.parentIds && member.parentIds.length > 0) {
      member.parentIds.forEach((parentId) => {
        edges.push({
          id: `parent-${parentId}-${member.id}`,
          source: parentId,
          target: member.id,
          type: 'parentChild',
          sourceHandle: 'bottom',
          targetHandle: 'top',
          data: { relationship: 'parentChild' },
        });
      });
    }
  });

  return edges;
};
```

### 2. Tier Mode Detection
Menambahkan deteksi tier mode berdasarkan `layoutDirection`:

```typescript
const { initialNodes, initialEdges } = useMemo(() => {
  const rawNodes = convertMembersToNodes(members);
  const isTierMode = layoutDirection === 'TB';
  const rawEdges = createFamilyEdges(members, isTierMode);
  
  // ... rest of the logic
}, [members, onMemberAdd, onMemberDelete, layoutDirection]);
```

### 3. Handle ID Assignment
**File:** `src/components/FamilyTree/nodes/FamilyMemberNode.tsx`

Menambahkan `id` prop pada setiap Handle untuk referencing yang tepat:

```typescript
<Handle
  type="target"
  position={Position.Top}
  id="top"
  className="w-4 h-4 bg-gray-400 border-2 border-white"
  style={{ top: -8 }}
/>
<Handle
  type="source"
  position={Position.Bottom}
  id="bottom"
  className="w-4 h-4 bg-gray-400 border-2 border-white"
  style={{ bottom: -8 }}
/>
<Handle
  type="target"
  position={Position.Left}
  id="left"
  className="w-4 h-4 bg-gray-400 border-2 border-white"
  style={{ left: -8 }}
/>
<Handle
  type="source"
  position={Position.Right}
  id="right"
  className="w-4 h-4 bg-gray-400 border-2 border-white"
  style={{ right: -8 }}
/>
```

## Behavior Differences

### Tier Mode (TB Layout)
- **Garis Pasangan**: Menggunakan handle `right` → `left` (horizontal)
- **Garis Parent-Child**: Menggunakan handle `bottom` → `top` (vertikal)
- **Karakteristik**: Hierarki vertikal dengan pasangan sejajar horizontal

### Free Layout Mode (LR Layout)
- **Garis Pasangan**: Menggunakan handle `bottom` → `top` (vertikal)
- **Garis Parent-Child**: Menggunakan handle `bottom` → `top` (vertikal)
- **Karakteristik**: Layout bebas dengan dragre algorithm

## Technical Benefits

1. **Visual Clarity**: Garis pasangan horizontal lebih intuitif dalam tier mode
2. **Separation of Concerns**: Parent-child relationships tetap vertikal
3. **Mode-Aware**: Behavior berbeda sesuai dengan layout mode
4. **Backward Compatible**: Free layout mode tidak terpengaruh

## Files Modified

1. **ReactFlowFamilyTree.tsx**
   - Enhanced `createFamilyEdges()` function
   - Added tier mode detection
   - Updated useMemo dependencies

2. **FamilyMemberNode.tsx**
   - Added handle ID assignments
   - Enhanced handle positioning

## Testing Considerations

1. **Visual Testing**: Verify horizontal lines for spouses in tier mode
2. **Mode Switching**: Test behavior when switching between TB and LR layouts
3. **Edge Cases**: Test with multiple spouses, complex relationships
4. **Performance**: Ensure no regression in edge creation performance

## Future Enhancements

1. **Custom Handle Styling**: Different colors for different relationship types
2. **Smart Handle Selection**: Dynamic handle selection based on node positions
3. **Animation**: Smooth transitions when switching between modes
4. **Handle Customization**: User-configurable handle positions per relationship type
