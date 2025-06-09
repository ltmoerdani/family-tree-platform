import React, { useState } from 'react';
import { X, TreePine, AlertCircle } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';

interface CreateFamilyTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateFamilyTreeModal: React.FC<CreateFamilyTreeModalProps> = ({
  isOpen,
  onClose
}) => {
  const { createFamilyTree } = useDashboardStore();
  const [familyName, setFamilyName] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!familyName.trim()) {
      setError('Nama keluarga harus diisi');
      return;
    }

    if (familyName.trim().length < 3) {
      setError('Nama keluarga minimal 3 karakter');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTree = createFamilyTree(familyName.trim());
      
      // Close modal and redirect to family tree interface
      onClose();
      setFamilyName('');
      
      // Navigate to the new family tree
      window.location.href = `/family-tree/${newTree.id}`;
    } catch (err) {
      setError('Gagal membuat family tree. Silakan coba lagi.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      onClose();
      setFamilyName('');
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <TreePine className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Buat Family Tree Baru</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isCreating}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="family-name" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Keluarga
            </label>
            <input
              id="family-name"
              type="text"
              value={familyName}
              onChange={(e) => {
                setFamilyName(e.target.value);
                setError('');
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Contoh: Keluarga Sutrisno, Keluarga Handayani"
              disabled={isCreating}
              autoFocus
            />
            {error && (
              <div className="mt-2 flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">Tips Penamaan:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Gunakan nama marga atau nama keluarga besar</li>
              <li>• Contoh: "Keluarga Besar Wijaya", "Marga Sitorus"</li>
              <li>• Hindari nama yang terlalu spesifik</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isCreating}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              BATAL
            </button>
            <button
              type="submit"
              disabled={isCreating || !familyName.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
            >
              {isCreating && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{isCreating ? 'MEMBUAT...' : 'BUAT'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};