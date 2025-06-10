import React, { useState } from 'react';
import { X, Users, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Heart, Baby, UserPlus } from 'lucide-react';

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
          { 
            value: 'husband', 
            label: 'Suami', 
            icon: <Users className="w-5 h-5" />,
            description: 'Tambah suami sebagai pasangan',
            color: 'blue'
          },
          { 
            value: 'wife', 
            label: 'Istri', 
            icon: <Heart className="w-5 h-5" />,
            description: 'Tambah istri sebagai pasangan',
            color: 'pink'
          },
          { 
            value: 'partner', 
            label: 'Pasangan', 
            icon: <Users className="w-5 h-5" />,
            description: 'Tambah pasangan hidup',
            color: 'purple'
          }
        ];
      case 'up':
        return [
          { 
            value: 'father', 
            label: 'Ayah', 
            icon: <UserPlus className="w-5 h-5" />,
            description: 'Tambah ayah kandung',
            color: 'blue'
          },
          { 
            value: 'mother', 
            label: 'Ibu', 
            icon: <UserPlus className="w-5 h-5" />,
            description: 'Tambah ibu kandung',
            color: 'pink'
          },
          { 
            value: 'both_parents', 
            label: 'Kedua Orang Tua', 
            icon: <Users className="w-5 h-5" />,
            description: 'Tambah ayah dan ibu sekaligus',
            color: 'green'
          },
          { 
            value: 'grandfather', 
            label: 'Kakek', 
            icon: <UserPlus className="w-5 h-5" />,
            description: 'Tambah kakek',
            color: 'gray'
          },
          { 
            value: 'grandmother', 
            label: 'Nenek', 
            icon: <UserPlus className="w-5 h-5" />,
            description: 'Tambah nenek',
            color: 'gray'
          }
        ];
      case 'down':
        return [
          { 
            value: 'biological_child', 
            label: 'Anak Kandung', 
            icon: <Baby className="w-5 h-5" />,
            description: 'Tambah anak kandung',
            color: 'green'
          },
          { 
            value: 'step_child', 
            label: 'Anak Tiri', 
            icon: <UserPlus className="w-5 h-5" />,
            description: 'Tambah anak tiri',
            color: 'orange'
          },
          { 
            value: 'adopted_child', 
            label: 'Anak Adopsi', 
            icon: <Heart className="w-5 h-5" />,
            description: 'Tambah anak adopsi',
            color: 'purple'
          },
          { 
            value: 'grandchild', 
            label: 'Cucu', 
            icon: <Baby className="w-5 h-5" />,
            description: 'Tambah cucu',
            color: 'yellow'
          },
          { 
            value: 'great_grandchild', 
            label: 'Cicit', 
            icon: <Baby className="w-5 h-5" />,
            description: 'Tambah cicit',
            color: 'indigo'
          }
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

  const getDirectionDescription = () => {
    switch (direction) {
      case 'up':
        return 'Anggota baru akan muncul di atas card ini';
      case 'down':
        return 'Anggota baru akan muncul di bawah card ini';
      case 'left':
        return 'Anggota baru akan muncul di sebelah kiri card ini';
      case 'right':
        return 'Anggota baru akan muncul di sebelah kanan card ini';
    }
  };

  const handleContinue = () => {
    if (selectedRelationship) {
      onSelect(selectedRelationship);
    }
  };

  const relationshipOptions = getRelationshipOptions();

  const getColorClasses = (color: string, isSelected: boolean) => {
    const baseClasses = 'border-2 rounded-lg transition-all duration-200';
    
    if (isSelected) {
      switch (color) {
        case 'blue': return `${baseClasses} border-blue-500 bg-blue-50`;
        case 'pink': return `${baseClasses} border-pink-500 bg-pink-50`;
        case 'green': return `${baseClasses} border-green-500 bg-green-50`;
        case 'purple': return `${baseClasses} border-purple-500 bg-purple-50`;
        case 'orange': return `${baseClasses} border-orange-500 bg-orange-50`;
        case 'yellow': return `${baseClasses} border-yellow-500 bg-yellow-50`;
        case 'indigo': return `${baseClasses} border-indigo-500 bg-indigo-50`;
        case 'gray': return `${baseClasses} border-gray-500 bg-gray-50`;
        default: return `${baseClasses} border-blue-500 bg-blue-50`;
      }
    }
    
    return `${baseClasses} border-gray-200 hover:border-gray-300 hover:bg-gray-50`;
  };

  const getIconColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600';
      case 'pink': return 'text-pink-600';
      case 'green': return 'text-green-600';
      case 'purple': return 'text-purple-600';
      case 'orange': return 'text-orange-600';
      case 'yellow': return 'text-yellow-600';
      case 'indigo': return 'text-indigo-600';
      case 'gray': return 'text-gray-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              {getDirectionIcon()}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{getDirectionTitle()}</h3>
              <p className="text-sm text-gray-600">{getDirectionDescription()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Pilih jenis hubungan:</h4>
          </div>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {relationshipOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-start p-4 cursor-pointer ${getColorClasses(option.color, selectedRelationship === option.value)}`}
              >
                <input
                  type="radio"
                  name="relationship"
                  value={option.value}
                  checked={selectedRelationship === option.value}
                  onChange={(e) => setSelectedRelationship(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-start space-x-3 w-full">
                  <div className={`p-2 rounded-lg bg-white shadow-sm ${getIconColorClasses(option.color)}`}>
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {option.description}
                    </div>
                  </div>
                  {selectedRelationship === option.value && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
          >
            Batal
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedRelationship}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
          >
            <span>Lanjutkan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};