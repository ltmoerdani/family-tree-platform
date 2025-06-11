import React from 'react';
import { BackgroundVariant } from 'reactflow';
import { 
  Maximize, 
  ArrowUpDown, 
  ArrowLeftRight,
  RefreshCw,
  Grid3X3,
  Circle,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';

interface FamilyTreeControlsProps {
  onLayoutChange: (direction: 'TB' | 'LR') => void;
  onAutoLayout: () => void;
  onFitView: () => void;
  currentLayout: 'TB' | 'LR';
  gridType?: BackgroundVariant;
  showGrid?: boolean;
  onGridTypeChange?: (type: BackgroundVariant) => void;
  onGridToggle?: (show: boolean) => void;
}

export const FamilyTreeControls: React.FC<FamilyTreeControlsProps> = ({
  onLayoutChange,
  onAutoLayout,
  onFitView,
  currentLayout,
  gridType = 'lines',
  showGrid = true,
  onGridTypeChange,
  onGridToggle,
}) => {
  /**
   * Handles grid type change with proper type safety
   * @param type - The grid type to set
   */
  const handleGridTypeChange = (type: string) => {
    if (onGridTypeChange) {
      onGridTypeChange(type as BackgroundVariant);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-2 space-y-2">
      <div className="text-xs font-medium text-gray-700 px-2">Layout Controls</div>
      
      {/* Layout direction buttons */}
      <div className="flex space-x-1">
        <button
          onClick={() => onLayoutChange('TB')}
          className={`p-2 rounded transition-colors ${
            currentLayout === 'TB'
              ? 'bg-blue-100 text-blue-600'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          title="Tier Layout (Generasi tersusun rapi)"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onLayoutChange('LR')}
          className={`p-2 rounded transition-colors ${
            currentLayout === 'LR'
              ? 'bg-blue-100 text-blue-600'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          title="Free Layout (Susunan bebas)"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>
      </div>

      {currentLayout === 'TB' && (
        <div className="text-xs text-gray-500 px-2 py-1 bg-blue-50 rounded">
          Tier mode: Drag kiri-kanan saja
        </div>
      )}

      <hr className="border-gray-200" />

      {/* Grid Controls */}
      {onGridTypeChange && onGridToggle && (
        <>
          <div className="text-xs font-medium text-gray-700 px-2">Grid Pattern</div>
          
          {/* Grid Toggle */}
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-gray-600">Show Grid</span>
            <button
              onClick={() => onGridToggle(!showGrid)}
              className={`p-1 rounded transition-colors ${
                showGrid ? 'text-blue-600' : 'text-gray-400'
              }`}
              title={showGrid ? 'Hide Grid' : 'Show Grid'}
            >
              {showGrid ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          {/* Grid Type Buttons */}
          {showGrid && (
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => handleGridTypeChange('dots')}
                className={`p-2 rounded transition-colors ${
                  gridType === 'dots'
                    ? 'bg-green-100 text-green-600'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="Dot Grid"
              >
                <Circle className="w-4 h-4 mx-auto" />
              </button>
              
              <button
                onClick={() => handleGridTypeChange('lines')}
                className={`p-2 rounded transition-colors ${
                  gridType === 'lines'
                    ? 'bg-green-100 text-green-600'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="Line Grid"
              >
                <Grid3X3 className="w-4 h-4 mx-auto" />
              </button>
              
              <button
                onClick={() => handleGridTypeChange('cross')}
                className={`p-2 rounded transition-colors ${
                  gridType === 'cross'
                    ? 'bg-green-100 text-green-600'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="Cross Grid"
              >
                <Plus className="w-4 h-4 mx-auto" />
              </button>
            </div>
          )}

          <hr className="border-gray-200" />
        </>
      )}

      {/* Action buttons */}
      <div className="space-y-1">
        <button
          onClick={onAutoLayout}
          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
          title="Auto Layout"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Auto Layout</span>
        </button>
        
        <button
          onClick={onFitView}
          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
          title="Fit to View"
        >
          <Maximize className="w-4 h-4" />
          <span>Fit View</span>
        </button>
      </div>
    </div>
  );
};