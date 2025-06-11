import React, { useState } from 'react';
import { User, Plus } from 'lucide-react';
import { Header } from '../Header/Header';
import { Toolbar } from '../Toolbar/Toolbar';
import { StatsSidebar } from '../Sidebar/StatsSidebar';
import { BottomNavigation } from '../BottomNavigation/BottomNavigation';
import { UnifiedMemberModal } from '../Forms/UnifiedMemberModal';
import { TreeCanvas } from './TreeCanvas';
import { useFamilyStore } from '../../store/familyStore';

interface NewFamilyTreeCanvasProps {
  familyTreeName: string;
  onBackToDashboard: () => void;
}

export const NewFamilyTreeCanvas: React.FC<NewFamilyTreeCanvasProps> = ({
  familyTreeName,
  onBackToDashboard
}) => {
  const { members } = useFamilyStore();
  const [showAddFirstMemberModal, setShowAddFirstMemberModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAddFirstMember = () => {
    setShowAddFirstMemberModal(true);
  };

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check if we have any members to show
  const hasMembers = members.length > 0;

  return (
    <div className="h-screen flex flex-col bg-gray-50" data-testid="new-family-tree-canvas">
      {/* Header */}
      <Header onMenuToggle={handleMenuToggle} familyName={familyTreeName} />
      
      {/* Toolbar */}
      <Toolbar onBackToDashboard={onBackToDashboard} />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Stats */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
          <StatsSidebar />
        </div>
        
        {/* Main Canvas Area - Use TreeCanvas for consistency */}
        <div className="flex-1 flex flex-col">
          {hasMembers ? (
            /* Use existing TreeCanvas component for consistency */
            <TreeCanvas />
          ) : (
            /* Empty state with consistent styling */
            <div className="flex-1 bg-gray-50 relative">
              <div 
                className="w-full h-full relative"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    {/* Empty Member Card - Using consistent spacing values */}
                    <button 
                      type="button"
                      onClick={handleAddFirstMember}
                      className="group relative bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      style={{
                        width: '280px',  // Consistent with TreeCanvas card width
                        height: '200px', // Professional spacing
                      }}
                      aria-label="Tambah anggota pertama keluarga"
                      aria-describedby="first-member-description"
                    >
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 group-hover:bg-green-100 rounded-full flex items-center justify-center mb-4 transition-colors">
                          <User className="w-8 h-8 text-gray-400 group-hover:text-green-600 transition-colors" />
                        </div>
                        
                        <h3 className="font-semibold text-gray-700 group-hover:text-gray-900 mb-2 transition-colors">
                          Anggota Pertama
                        </h3>
                        
                        <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 group-hover:bg-green-100 rounded-lg transition-colors">
                          <Plus className="w-4 h-4 text-gray-500 group-hover:text-green-600 transition-colors" />
                          <span className="text-sm font-medium text-gray-600 group-hover:text-green-700 transition-colors">
                            TAMBAH INFO
                          </span>
                        </div>

                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-green-500 bg-opacity-0 group-hover:bg-opacity-5 rounded-xl transition-all duration-200" />
                      </div>
                    </button>

                    {/* Guidance Text - Positioned below with consistent spacing */}
                    <div className="mt-8 max-w-md" id="first-member-description">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm">💡</span>
                        </div>
                        <p className="text-gray-600 font-medium">
                          Mulai dengan menambahkan anggota pertama keluarga
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 text-center">
                        (bisa diri sendiri, orang tua, atau kakek/nenek)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
      
      {/* Add First Member Modal */}
      <UnifiedMemberModal
        isOpen={showAddFirstMemberModal}
        onClose={() => setShowAddFirstMemberModal(false)}
        familyTreeName={familyTreeName}
        isFirstMember={!hasMembers}
      />
    </div>
  );
};