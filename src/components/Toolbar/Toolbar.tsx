import * as React from 'react';
import { Eye, Edit3, Save, X, ArrowLeft } from 'lucide-react';
import { useFamilyStore } from '../../store/familyStore';

interface ToolbarProps {
  onBackToDashboard?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onBackToDashboard }) => {
  const { viewMode, setViewMode, editMode, setEditMode, hasUnsavedChanges } = useFamilyStore();

  const handleViewChange = (type: 'tree' | 'card' | 'list') => {
    setViewMode({ type });
  };

  const handleEditModeToggle = () => {
    if (editMode && hasUnsavedChanges) {
      if (confirm('Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar dari mode edit?')) {
        setEditMode(false);
      }
    } else {
      setEditMode(!editMode);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Back to Dashboard Button */}
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          )}

          {/* Divider */}
          {onBackToDashboard && (
            <div className="h-6 w-px bg-gray-300" />
          )}

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

          {/* Edit Mode Toggle - Only for Tree View */}
          {viewMode.type === 'tree' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Mode:</span>
              <button
                onClick={handleEditModeToggle}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                  editMode
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {editMode ? (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span className="font-medium">Edit Mode</span>
                    {hasUnsavedChanges && (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    )}
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>View Mode</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select 
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={viewMode.selectedGeneration ?? ''}
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

        {/* Edit Mode Actions */}
        {editMode && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {/* Handle save all changes */}}
              className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Semua</span>
            </button>
            
            <button
              onClick={() => setEditMode(false)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Keluar Edit</span>
            </button>
          </div>
        )}
      </div>

      {/* Edit Mode Info Bar */}
      {editMode && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Mode Edit Aktif - Klik card untuk edit, gunakan ikon + untuk menambah anggota
              </span>
            </div>
            <div className="text-xs text-blue-600">
              Tip: Klik area kosong untuk keluar dari mode edit
            </div>
          </div>
        </div>
      )}
    </div>
  );
};