import { useEffect, useState, useCallback } from 'react';
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
import { FamilyTree, FamilyTreeNavigationState, NavigationHandlers, AppView, ViewNavigationResult } from './types/dashboard';

/**
 * Utility function to handle family tree navigation logic
 * Reduces code duplication and follows Single Responsibility Principle
 * @param treeId - ID of the family tree to navigate to
 * @param familyTrees - Array of available family trees
 * @param setMembers - Function to set family members
 * @returns Navigation state or null if tree not found
 */
const handleFamilyTreeNavigation = (
  treeId: string, 
  familyTrees: FamilyTree[], 
  setMembers: NavigationHandlers['setMembers']
): FamilyTreeNavigationState | null => {
  const familyTree = familyTrees.find(tree => tree.id === treeId);
  
  if (!familyTree) {
    return null; // Caller should handle redirect to dashboard
  }
  
  // Load appropriate data based on family tree
  if (treeId === 'wijaya-family') {
    // Load existing mock data for Wijaya family
    setMembers(mockFamilyData);
  } else {
    // For new family trees, start with empty members array
    setMembers([]);
  }
  
  return {
    treeId,
    familyTree,
    currentFamilyTreeName: familyTree.name
  };
};

/**
 * Utility function to handle URL path routing
 * Centralizes routing logic for better maintainability
 * @param path - URL path to parse
 * @returns Object containing view type and optional tree ID
 */
const getViewFromPath = (path: string): ViewNavigationResult => {
  if (path === '/' || path === '') {
    return { view: 'dashboard' };
  } else if (path.startsWith('/family-tree/')) {
    const treeId = path.split('/family-tree/')[1];
    return { view: 'family-tree', treeId };
  } else if (path === '/upgrade') {
    return { view: 'upgrade' };
  } else if (path === '/dashboard') {
    return { view: 'dashboard' };
  } else {
    return { view: 'dashboard' }; // Default fallback
  }
};

function App() {
  const { setMembers, selectedMember } = useFamilyStore();
  const { familyTrees } = useDashboardStore();
  useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [currentFamilyTreeName, setCurrentFamilyTreeName] = useState<string>('');

  console.log('App render - currentView:', currentView);
  console.log('App render - familyTrees:', familyTrees.length);

  /**
   * Handles view switching with proper navigation and data loading
   * Extracted to reduce code duplication
   */
  const switchToView = useCallback((path: string) => {
    const { view, treeId } = getViewFromPath(path);
    
    if (view === 'family-tree' && treeId) {
      const navigationResult = handleFamilyTreeNavigation(treeId, familyTrees, setMembers);
      
      if (!navigationResult) {
        // Family tree not found, redirect to dashboard
        window.history.pushState({}, '', '/dashboard');
        setCurrentView('dashboard');
        return;
      }
      
      setCurrentFamilyTreeName(navigationResult.currentFamilyTreeName);
      setCurrentView('family-tree');
    } else {
      setCurrentView(view);
      if (view === 'dashboard') {
        setCurrentFamilyTreeName('');
      }
    }
  }, [familyTrees, setMembers]);

  // Initial URL handling
  useEffect(() => {
    const path = window.location.pathname;
    console.log('App loading with path:', path);
    
    if (path === '/' || path === '') {
      window.history.replaceState({}, '', '/dashboard');
    }
    
    switchToView(path);
  }, [switchToView]);

  // Handle navigation events
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      switchToView(path);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [switchToView]);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
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
      </div>
    </ProtectedRoute>
  );
}

export default App;