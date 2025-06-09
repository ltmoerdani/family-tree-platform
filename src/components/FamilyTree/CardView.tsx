import React from 'react';
import { MemberCardGrid } from './MemberCardGrid';
import { useFamilyStore } from '../../store/familyStore';

export const CardView: React.FC = () => {
  const { viewMode } = useFamilyStore();

  if (viewMode.type !== 'card') return null;

  return (
    <div className="flex-1 flex flex-col">
      <MemberCardGrid />
    </div>
  );
};