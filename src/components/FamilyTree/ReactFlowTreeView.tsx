import React from 'react';
import { ReactFlowFamilyTree } from './ReactFlowFamilyTree';
import { useFamilyStore } from '../../store/familyStore';
import { FamilyMember } from '../../types/family';

interface MemberUpdateData extends Partial<FamilyMember> {
  id: string;
}

type NewMemberData = Partial<FamilyMember>

export const ReactFlowTreeView: React.FC = () => {
  const { members, addMember, updateMember, deleteMember } = useFamilyStore();

  const handleMemberUpdate = (updatedMember: MemberUpdateData) => {
    updateMember(updatedMember.id, updatedMember);
  };

  const handleMemberAdd = (newMember: NewMemberData) => {
    const member: FamilyMember = {
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