import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useDashboardStore } from '../../store/dashboardStore';
import { NewFamilyTreeCanvas } from './NewFamilyTreeCanvas';
import App from '../../App';

export const FamilyTreeRouter: React.FC = () => {
  const { treeId } = useParams<{ treeId: string }>();
  const { familyTrees } = useDashboardStore();

  console.log('FamilyTreeRouter - treeId:', treeId);
  console.log('FamilyTreeRouter - familyTrees:', familyTrees);

  // Check if the family tree exists
  const familyTree = familyTrees.find(tree => tree.id === treeId);

  console.log('FamilyTreeRouter - found familyTree:', familyTree);

  if (!familyTree) {
    console.log('FamilyTreeRouter - family tree not found, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // For the Wijaya family, show the existing family tree interface
  if (treeId === 'wijaya-family') {
    console.log('FamilyTreeRouter - showing existing App for wijaya-family');
    return <App />;
  }

  // For new family trees, show the new canvas with empty state
  console.log('FamilyTreeRouter - showing NewFamilyTreeCanvas for:', familyTree.name);
  return (
    <NewFamilyTreeCanvas
      familyTreeName={familyTree.name}
      onBackToDashboard={() => window.location.href = '/dashboard'}
    />
  );
};