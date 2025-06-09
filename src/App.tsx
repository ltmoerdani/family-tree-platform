import { useEffect, useState } from 'react';
import { Header } from './components/Header/Header';
import { Toolbar } from './components/Toolbar/Toolbar';
import { StatsSidebar } from './components/Sidebar/StatsSidebar';
import { MemberDetailSidebar } from './components/Sidebar/MemberDetailSidebar';
import { FamilyTreeView } from './components/FamilyTree/FamilyTreeView';
import { BottomNavigation } from './components/BottomNavigation/BottomNavigation';
import { MiniMap } from './components/FloatingElements/MiniMap';
import { Legend } from './components/FloatingElements/Legend';
import { useFamilyStore } from './store/familyStore';
import { mockFamilyData } from './data/mockData';

function App() {
  const { setMembers, selectedMember } = useFamilyStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Load mock data - in real app, this would come from Supabase
    setMembers(mockFamilyData);
  }, [setMembers]);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header onMenuToggle={handleMenuToggle} familyName="Wijaya" />
      
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
      
      {/* Floating Elements */}
      <MiniMap />
      <Legend />
    </div>
  );
}

export default App;