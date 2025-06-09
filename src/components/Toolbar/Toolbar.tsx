import React from 'react';
import { Eye, Grid, List, ZoomIn, ZoomOut, Maximize, Filter } from 'lucide-react';
import { useFamilyStore } from '@/store/familyStore';

export const Toolbar: React.FC = () => {
  const { viewMode, setViewMode } = useFamilyStore();

  const handleViewChange = (type: 'tree' | 'card' | 'list') => {
    setViewMode({ type });
  };

  const handleZoomChange = (delta: number) => {
    const newZoom = Math.max(25, Math.min(200, viewMode.zoom + delta));
    setViewMode({ zoom: newZoom });
  };

  const handleFitScreen = () => {
    setViewMode({ zoom: 100 });
  };

  const isZoomDisabled = viewMode.type !== 'tree';

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* View Mode */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="flex rounded-lg border border-gray-300">
              <button
                onClick={() => handleViewChange('tree')}
                className={`px-3 py-1.5 text-sm rounded-l-lg transition-colors ${
                  viewMode.type === 'tree'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Pohon
              </button>
              <button
                onClick={() => handleViewChange('card')}
                className={`px-3 py-1.5 text-sm border-l border-gray-300 transition-colors ${
                  viewMode.type === 'card'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Kartu
              </button>
              <button
                onClick={() => handleViewChange('list')}
                className={`px-3 py-1.5 text-sm rounded-r-lg border-l border-gray-300 transition-colors ${
                  viewMode.type === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Daftar
              </button>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select 
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={viewMode.selectedGeneration || ''}
              onChange={(e) => setViewMode({ 
                selectedGeneration: e.target.value ? parseInt(e.target.value) : null 
              })}
            >
              <option value="">Semua Generasi</option>
              <option value="1">Generasi 1</option>
              <option value="2">Generasi 2</option>
              <option value="3">Generasi 3</option>
              <option value="4">Generasi 4</option>
            </select>
            
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={viewMode.showAlive}
                onChange={(e) => setViewMode({ showAlive: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Hidup</span>
            </label>
            
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={viewMode.showDeceased}
                onChange={(e) => setViewMode({ showDeceased: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Meninggal</span>
            </label>
          </div>
        </div>

        {/* Zoom Controls - Only for Tree View */}
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${isZoomDisabled ? 'opacity-50' : ''}`}>
            <button
              onClick={() => handleZoomChange(-25)}
              disabled={isZoomDisabled || viewMode.zoom <= 25}
              className="p-1.5 rounded hover:bg-gray-100 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="25"
                max="200"
                value={viewMode.zoom}
                onChange={(e) => setViewMode({ zoom: parseInt(e.target.value) })}
                disabled={isZoomDisabled}
                className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
              />
              <span className="text-sm font-medium text-gray-700 w-12">
                {viewMode.zoom}%
              </span>
            </div>
            
            <button
              onClick={() => handleZoomChange(25)}
              disabled={isZoomDisabled || viewMode.zoom >= 200}
              className="p-1.5 rounded hover:bg-gray-100 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={handleFitScreen}
            disabled={isZoomDisabled}
            className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
              isZoomDisabled 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Maximize className="w-4 h-4" />
            <span>Fit Screen</span>
          </button>
        </div>
      </div>
    </div>
  );
};