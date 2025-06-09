import { useEffect, useState } from 'react';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Dashboard } from './components/Dashboard/Dashboard';
import { UpgradePage } from './components/Upgrade/UpgradePage';
import { FamilyTreeRouter } from './components/FamilyTree/FamilyTreeRouter';
import { Header } from './components/Header/Header';
import { Toolbar } from './components/Toolbar/Toolbar';
import { StatsSidebar } from './components/Sidebar/StatsSidebar';
import { MemberDetailSidebar } from './components/Sidebar/MemberDetailSidebar';
import { FamilyTreeView } from './components/FamilyTree/FamilyTreeView';
import { BottomNavigation } from './components/BottomNavigation/BottomNavigation';
import { CanvasControls } from './components/FamilyTree/CanvasControls';

import { useFamilyStore } from './store/familyStore';
import { useAuthStore } from './store/authStore';
import { mockFamilyData } from './data/mockData';

function App() {
  const { setMembers, selectedMember, viewMode } = useFamilyStore();
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'family-tree' | 'upgrade'>('dashboard');

  useEffect(() => {
    // Check URL to determine current view
    const path = window.location.pathname;
    if (path.startsWith('/family-tree/')) {
      setCurrentView('family-tree');
      // Load mock data for family tree view
      setMembers(mockFamilyData);
    } else if (path === '/upgrade') {
      setCurrentView('upgrade');
    } else {
      setCurrentView('dashboard');
    }
  }, [setMembers]);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/family-tree/')) {
        setCurrentView('family-tree');
        setMembers(mockFamilyData);
      } else if (path === '/upgrade') {
        setCurrentView('upgrade');
      } else {
        setCurrentView('dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setMembers]);

  return (
    <ProtectedRoute>
      {currentView === 'dashboard' ? (
        <Dashboard />
      ) : currentView === 'upgrade' ? (
        <UpgradePage />
      ) : (
        <div className="h-screen flex flex-col bg-gray-50">
          {/* Header */}
          <Header onMenuToggle={handleMenuToggle} familyName={user?.familyName ?? "Keluarga"} />
          
          {/* Back to Dashboard Button */}
          <div className="bg-white border-b border-gray-200 px-4 py-2">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/dashboard');
                setCurrentView('dashboard');
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Kembali ke Dashboard
            </button>
          </div>
          
          {/* Toolbar */}
          <Toolbar />
          
          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Stats */}
            <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
              <StatsSidebar />
            </div>
            
            {/* Main Canvas Area */}
            <div className="flex-1 flex flex-col">
              <FamilyTreeView />
            </div>
            
            {/* Right Sidebar - Member Details */}
            {selectedMember && <MemberDetailSidebar />}
          </div>
          
          {/* Bottom Navigation */}
          <BottomNavigation />
          
          {/* Canvas Controls - Fixed position on right side, above bottom navigation */}
          {/* Only show when in tree view mode */}
          {viewMode.type === 'tree' && (
            <div 
              className="fixed right-4 pointer-events-auto"
              style={{
                bottom: '80px', // Above bottom navigation (assuming 64px height + 16px margin)
                zIndex: 1000,
              }}
            >
              <CanvasControls />
            </div>
          )}
        </div>
      )}
    </ProtectedRoute>
  );
}

export default App;