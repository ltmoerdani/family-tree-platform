import React, { useState } from 'react';
import { X, Users, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface RelationshipSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  direction: 'up' | 'down' | 'left' | 'right';
  onSelect: (relationship: string) => void;
}

export const RelationshipSelectionModal: React.FC<RelationshipSelectionModalProps> = ({
  isOpen,
  onClose,
  direction,
  onSelect
}) => {
  const [selectedRelationship, setSelectedRelationship] = useState('');

  if (!isOpen) return null;

  const getRelationshipOptions = () => {
    switch (direction) {
      case 'left':
      case 'right':
        return [
          { value: 'husband', label: 'Suami' },
          { value: 'wife', label: 'Istri' },
          { value: 'partner', label: 'Pasangan' }
        ];
      case 'up':
        return [
          { value: 'father', label: 'Ayah' },
          { value: 'mother', label: 'Ibu' },
          { value: 'both_parents', label: 'Kedua Orang Tua' },
          { value: 'grandfather', label: 'Kakek' },
          { value: 'grandmother', label: 'Nenek' }
        ];
      case 'down':
        return [
          { value: 'biological_child', label: 'Anak Kandung' },
          { value: 'step_child', label: 'Anak Tiri' },
          { value: 'adopted_child', label: 'Anak Adopsi' },
          { value: 'grandchild', label: 'Cucu' },
          { value: 'great_grandchild', label: 'Cicit' }
        ];
      default:
        return [];
    }
  };

  const getDirectionIcon = () => {
    switch (direction) {
      case 'up':
        return <ArrowUp className="w-5 h-5" />;
      case 'down':
        return <ArrowDown className="w-5 h-5" />;
      case 'left':
        return <ArrowLeft className="w-5 h-5" />;
      case 'right':
        return <ArrowRight className="w-5 h-5" />;
    }
  };

  const getDirectionTitle = () => {
    switch (direction) {
      case 'up':
        return 'Tambah Generasi Atas';
      case 'down':
        return 'Tambah Generasi Bawah';
      case 'left':
        return 'Tambah Pasangan (Kiri)';
      case 'right':
        return 'Tambah Pasangan (Kanan)';
    }
  };

  const handleContinue = () => {
    if (selectedRelationship) {
      onSelect(selectedRelationship);
    }
  };

  const relationshipOptions = getRelationshipOptions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-80 max-w-sm mx-4 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              {getDirectionIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{getDirectionTitle()}</h3>
              <p className="text-sm text-gray-600">Pilih jenis hubungan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="space-y-3">
            {relationshipOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedRelationship === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="relationship"
                  value={option.value}
                  checked={selectedRelationship === option.value}
                  onChange={(e) => setSelectedRelationship(e.target.value)}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedRelationship}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};