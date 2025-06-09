import React from 'react';
import { useFamilyStore } from '@/store/familyStore';

export const MiniMap: React.FC = () => {
  const { members, viewMode } = useFamilyStore();

  return (
    <div className="fixed bottom-4 right-4 w-48 h-32 bg-white border border-gray-300 rounded-lg shadow-lg p-2">
      <div className="text-xs font-medium text-gray-600 mb-2">Mini Map</div>
      <div className="w-full h-full bg-gray-100 rounded relative overflow-hidden">
        {/* Simplified tree representation */}
        {members.slice(0, 10).map((member, index) => (
          <div
            key={member.id}
            className={`absolute w-2 h-2 rounded-full ${
              member.gender === 'male' ? 'bg-blue-400' : 'bg-pink-400'
            }`}
            style={{
              left: `${(index % 4) * 25 + 10}%`,
              top: `${Math.floor(index / 4) * 30 + 10}%`,
            }}
          />
        ))}
        
        {/* Viewport indicator */}
        <div className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-30 w-8 h-6 top-2 left-2" />
      </div>
    </div>
  );
};