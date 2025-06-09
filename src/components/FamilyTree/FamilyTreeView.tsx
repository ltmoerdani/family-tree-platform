import React from 'react';
import { TreeCanvas } from './TreeCanvas';
import { CardView } from './CardView';
import { ListView } from './ListView';
import { useFamilyStore } from '../../store/familyStore';

export const FamilyTreeView: React.FC = () => {
  const { viewMode } = useFamilyStore();

  return (
    <div className="flex-1 flex flex-col">
      {viewMode.type === 'tree' && <TreeCanvas />}
      {viewMode.type === 'card' && <CardView />}
      {viewMode.type === 'list' && <ListView />}
    </div>
  );
};