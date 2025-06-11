import { useEffect, useState } from 'react';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Dashboard } from './components/Dashboard/Dashboard';
import { UpgradePage } from './components/Upgrade/UpgradePage';
import { Header } from './components/Header/Header';
import { Toolbar } from './components/Toolbar/Toolbar';
import { StatsSidebar } from './components/Sidebar/StatsSidebar';
import { MemberDetailSidebar } from './components/Sidebar/MemberDetailSidebar';
import { FamilyTreeView } from './components/FamilyTree/FamilyTreeView';
import { BottomNavigation } from './components/BottomNavigation/BottomNavigation';

import { useFamilyStore } from './store/familyStore';
import { useDashboardStore } from './store/dashboardStore';
import { useAuthStore } from './store/authStore';
import { mockFamilyData } from './data/mockData';

function App() {
  const { setMembers, selectedMember } = useFamilyStore();
  const { familyTrees } = useDashboardStore();
  useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'family-tree' | 'upgrade'>('dashboard');
  const [currentFamilyTreeName, setCurrentFamilyTreeName] = useState<string>('');

  useEffect(() => {
    // Check URL to determine current view
    const path = window.location.pathname;
    
    if (path.startsWith('/family-tree/')) {
      const treeId = path.split('/family-tree/')[1];
      const familyTree = familyTrees.find(tree => tree.id === treeId);
      
      if (!familyTree) {
        // Family tree not found, redirect to dashboard
        window.history.pushState({}, '', '/dashboard');
        setCurrentView('dashboard');
        return;
      }
      
      setCurrentFamilyTreeName(familyTree.name);
      setCurrentView('family-tree');
      
      // Load appropriate data based on family tree
      if (treeId === 'wijaya-family') {
        // Load existing mock data for Wijaya family
        setMembers(mockFamilyData);
      } else {
        // For new family trees, start with empty members array
        // TreeCanvas will handle empty state properly
        setMembers([]);
      }
    } else if (path === '/upgrade') {
      setCurrentView('upgrade');
    } else {
      setCurrentView('dashboard');
    }
  }, [setMembers, familyTrees]);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/family-tree/')) {
        const treeId = path.split('/family-tree/')[1];
        const familyTree = familyTrees.find(tree => tree.id === treeId);
        
        if (!familyTree) {
          setCurrentView('dashboard');
          return;
        }
        
        setCurrentFamilyTreeName(familyTree.name);
        setCurrentView('family-tree');
        
        // Load data consistently
        if (treeId === 'wijaya-family') {
          setMembers(mockFamilyData);
        } else {
          setMembers([]);
        }
      } else if (path === '/upgrade') {
        setCurrentView('upgrade');
      } else {
        setCurrentView('dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setMembers, familyTrees]);

  return (
    <ProtectedRoute>
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'upgrade' && <UpgradePage />}
      {currentView === 'family-tree' && (
        <div className="h-screen flex flex-col bg-gray-50">
          {/* Header with consistent family name display */}
          <Header onMenuToggle={handleMenuToggle} familyName={currentFamilyTreeName} />
          
          {/* Toolbar */}
          <Toolbar 
            onBackToDashboard={() => {
              window.history.pushState({}, '', '/dashboard');
              setCurrentView('dashboard');
            }}
          />
          
          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Stats */}
            <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
              <StatsSidebar />
            </div>
            
            {/* Main Canvas Area - Always use FamilyTreeView for consistency */}
            <div className="flex-1 flex flex-col">
              <FamilyTreeView />
            </div>
            
            {/* Right Sidebar - Member Details */}
            {selectedMember && <MemberDetailSidebar />}
          </div>
          
          {/* Bottom Navigation */}
          <BottomNavigation />
        </div>
      )}
    </ProtectedRoute>
  );
}

export default App;