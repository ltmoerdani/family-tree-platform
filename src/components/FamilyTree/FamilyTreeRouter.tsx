import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useDashboardStore } from '../../store/dashboardStore';
import App from '../../App';

export const FamilyTreeRouter: React.FC = () => {
  const { treeId } = useParams<{ treeId: string }>();
  const { familyTrees } = useDashboardStore();

  // Check if the family tree exists
  const familyTree = familyTrees.find(tree => tree.id === treeId);

  if (!familyTree) {
    return <Navigate to="/dashboard\" replace />;
  }

  // For the Wijaya family, show the existing family tree interface
  if (treeId === 'wijaya-family') {
    return <App />;
  }

  // For new family trees, show empty state
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {familyTree.name}
        </h1>
        <p className="text-gray-600 mb-6">
          Family tree baru - mulai tambahkan anggota keluarga
        </p>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
};