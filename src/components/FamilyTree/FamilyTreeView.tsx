import React from 'react';
import { CardView } from './CardView';
import { ListView } from './ListView';
import { ReactFlowTreeView } from './ReactFlowTreeView';
import { useFamilyStore } from '../../store/familyStore';

export const FamilyTreeView: React.FC = () => {
  const { viewMode } = useFamilyStore();

  return (
    <div className="flex-1 flex flex-col">
      {viewMode.type === 'tree' && <ReactFlowTreeView />}
      {viewMode.type === 'card' && <CardView />}
      {viewMode.type === 'list' && <ListView />}
    </div>
  );
};