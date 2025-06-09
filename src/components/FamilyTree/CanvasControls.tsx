import React, { useState } from 'react';
import { useFamilyStore } from '../../store/familyStore';

export const CanvasControls: React.FC = () => {
  const { members } = useFamilyStore();
  const [activeTab, setActiveTab] = useState<'minimap' | 'legend'>('minimap');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className="bg-white border-2 border-gray-400 rounded-lg shadow-xl overflow-hidden max-w-64"
      style={{
        // Ensure it's visible with explicit positioning and styling
        position: 'relative',
        zIndex: 1000,
        minWidth: '200px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* Header with tabs and collapse button */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('minimap')}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors mr-1 ${
              activeTab === 'minimap'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            Mini Map
          </button>
          <button
            onClick={() => setActiveTab('legend')}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === 'legend'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            Legenda
          </button>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-gray-600 transition-colors text-xs"
        >
          {isCollapsed ? '▲' : '▼'}
        </button>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-3">
          {activeTab === 'minimap' && (
            <div className="space-y-2">
              <div className="w-48 h-32 bg-gray-100 rounded relative overflow-hidden border">
                {/* Minimap content */}
                {members.slice(0, 15).map((member, index) => (
                  <div
                    key={member.id}
                    className={`absolute w-1.5 h-1.5 rounded-full transition-all hover:scale-125 cursor-pointer ${
                      member.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
                    } ${!member.isAlive ? 'opacity-50 border border-gray-400' : ''}`}
                    style={{
                      left: `${(index % 8) * 12 + 5}%`,
                      top: `${Math.floor(index / 8) * 25 + 10}%`,
                    }}
                    title={`${member.name} (Gen ${member.generation})`}
                  />
                ))}
                
                {/* Viewport indicator */}
                <div className="absolute border-2 border-blue-600 bg-blue-200 bg-opacity-40 w-8 h-6 top-2 left-2 rounded-sm" />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{members.length} anggota</span>
                <span>{[...new Set(members.map(m => m.generation))].length} generasi</span>
              </div>
            </div>
          )}

          {activeTab === 'legend' && (
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-blue-200 rounded bg-white flex-shrink-0"></div>
                <span className="text-gray-700">Laki-laki</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-pink-200 rounded bg-white flex-shrink-0"></div>
                <span className="text-gray-700">Perempuan</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-gray-400 rounded bg-gray-50 flex-shrink-0"></div>
                <span className="text-gray-700">Almarhum</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-gray-600 flex-shrink-0"></div>
                <span className="text-gray-700">Hubungan Keluarga</span>
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-0.5 bg-red-500 flex-shrink-0"
                  style={{ 
                    backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 1px, #EF4444 1px, #EF4444 2px)' 
                  }}
                ></div>
                <span className="text-gray-700">Pernikahan</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full text-xs flex items-center justify-center flex-shrink-0">
                  💍
                </div>
                <span className="text-gray-700">Menikah</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};