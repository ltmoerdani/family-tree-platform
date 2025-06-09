import React from 'react';
import { TreeCanvas } from './TreeCanvas';
import { CardView } from './CardView';
import { useFamilyStore } from '@/store/familyStore';

export const FamilyTreeView: React.FC = () => {
  const { viewMode } = useFamilyStore();

  return (
    <div className="flex-1 flex flex-col">
      {viewMode.type === 'tree' && <TreeCanvas />}
      {viewMode.type === 'card' && <CardView />}
      {viewMode.type === 'list' && (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">List View</h3>
            <p className="text-sm">Coming soon...</p>
          </div>
        </div>
      )}
    </div>
  );
};