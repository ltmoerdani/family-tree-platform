import React from 'react';
import { ReactFlowFamilyTree } from './ReactFlowFamilyTree';
import { useFamilyStore } from '../../store/familyStore';

export const ReactFlowTreeView: React.FC = () => {
  const { members, addMember, updateMember, deleteMember } = useFamilyStore();

  const handleMemberUpdate = (updatedMember: any) => {
    updateMember(updatedMember.id, updatedMember);
  };

  const handleMemberAdd = (newMember: any) => {
    const member = {
      id: `member-${Date.now()}`,
      name: 'New Member',
      birthDate: new Date().toISOString().split('T')[0],
      gender: 'male' as const,
      isAlive: true,
      generation: 1,
      maritalStatus: 'single' as const,
      ...newMember,
    };
    addMember(member);
  };

  const handleMemberDelete = (memberId: string) => {
    deleteMember(memberId);
  };

  return (
    <div className="w-full h-full">
      <ReactFlowFamilyTree
        members={members}
        onMemberUpdate={handleMemberUpdate}
        onMemberAdd={handleMemberAdd}
        onMemberDelete={handleMemberDelete}
      />
    </div>
  );
};