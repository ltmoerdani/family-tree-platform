import React from 'react';

export const Legend: React.FC = () => {
  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
      <div className="text-sm font-medium text-gray-900 mb-3">Legenda</div>
      <div className="space-y-2 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-200 rounded bg-white"></div>
          <span>Laki-laki</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-pink-200 rounded bg-white"></div>
          <span>Perempuan</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-gray-400 rounded bg-gray-50"></div>
          <span>Almarhum</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-gray-600"></div>
          <span>Hubungan Keluarga</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-red-500" style={{ backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 2px, #EF4444 2px, #EF4444 4px)' }}></div>
          <span>Pernikahan</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full text-xs flex items-center justify-center">💍</div>
          <span>Menikah</span>
        </div>
      </div>
    </div>
  );
};