import React, { useState } from 'react';
import { Plus, Download, Printer, Share2, Map } from 'lucide-react';
import { useFamilyStore } from '@/store/familyStore';
import { AddMemberModal } from '@/components/Forms/AddMemberModal';

export const BottomNavigation: React.FC = () => {
  const { stats } = useFamilyStore();
  const [showAddModal, setShowAddModal] = useState(false);

  const generations = Array.from({ length: stats.totalGenerations }, (_, i) => i + 1);

  return (
    <>
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Generation Tabs */}
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium text-gray-700 mr-3">Generasi:</span>
            <div className="flex space-x-1">
              {generations.map(gen => (
                <button
                  key={gen}
                  className="px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 transition-colors"
                >
                  {gen}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Anggota</span>
            </button>
            
            <button className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            <button className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            
            <button className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      <AddMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </>
  );
};