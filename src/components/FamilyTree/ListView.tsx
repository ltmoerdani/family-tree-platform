import React from 'react';
import { FamilyTable } from './FamilyTable';
import { useFamilyStore } from '@/store/familyStore';

export const ListView: React.FC = () => {
  const { viewMode } = useFamilyStore();

  if (viewMode.type !== 'list') return null;

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <FamilyTable />
    </div>
  );
};