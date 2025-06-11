import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useDashboardStore } from '../../store/dashboardStore';
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

  // All family trees use the same App component for consistency
  console.log('FamilyTreeRouter - showing App for:', familyTree.name);
  return <App />;
};