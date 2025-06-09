import { useEffect, useState } from 'react';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
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

  useEffect(() => {
    // Load mock data - in real app, this would come from Supabase
    setMembers(mockFamilyData);
  }, [setMembers]);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <Header onMenuToggle={handleMenuToggle} familyName={user?.familyName ?? "Keluarga"} />
        
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
    </ProtectedRoute>
  );
}

export default App;