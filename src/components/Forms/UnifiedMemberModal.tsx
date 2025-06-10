import React, { useState, useEffect } from 'react';
import { X, AlertCircle, User, Calendar, MapPin } from 'lucide-react';
import { FamilyMember } from '../../types/family';
import { useFamilyStore } from '../../store/familyStore';

interface UnifiedMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingMember?: FamilyMember;
  familyTreeName?: string;
  isFirstMember?: boolean;
}

interface FormData {
  name: string;
  nickname: string;
  gender: 'male' | 'female';
  birthDate: string;
  birthPlace: string;
  isAlive: boolean;
  deathDate: string;
  role?: 'myself' | 'parent' | 'grandparent' | 'other'; // Only for first member
}

const initialFormData: FormData = {
  name: '',
  nickname: '',
  gender: 'male',
  birthDate: '',
  birthPlace: '',
  isAlive: true,
  deathDate: '',
  role: 'myself'
};

export const UnifiedMemberModal: React.FC<UnifiedMemberModalProps> = ({
  isOpen,
  onClose,
  editingMember,
  familyTreeName,
  isFirstMember = false
}) => {
  const { addMember, updateMember } = useFamilyStore();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data for editing
  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name ?? '',
        nickname: editingMember.nickname ?? '',
        gender: editingMember.gender ?? 'male',
        birthDate: editingMember.birthDate ?? '',
        birthPlace: editingMember.birthPlace ?? '',
        isAlive: editingMember.isAlive ?? true,
        deathDate: editingMember.deathDate ?? '',
        role: 'myself'
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingMember, isOpen]);

  if (!isOpen) return null;

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Nama lengkap harus diisi');
      return false;
    }

    if (formData.name.trim().length < 2) {
      setError('Nama minimal 2 karakter');
      return false;
    }

    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      if (isNaN(birthDate.getTime())) {
        setError('Format tanggal lahir tidak valid');
        return false;
      }
    }

    if (!formData.isAlive && formData.deathDate) {
      const deathDate = new Date(formData.deathDate);
      const birthDate = new Date(formData.birthDate);
      if (birthDate > deathDate) {
        setError('Tanggal wafat tidak boleh lebih awal dari tanggal lahir');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const memberData: Partial<FamilyMember> = {
        name: formData.name.trim(),
        nickname: formData.nickname.trim() || undefined,
        gender: formData.gender,
        birthDate: formData.birthDate || undefined,
        birthPlace: formData.birthPlace.trim() || undefined,
        isAlive: formData.isAlive,
        deathDate: !formData.isAlive ? formData.deathDate || undefined : undefined
      };

      if (editingMember) {
        // Update existing member
        updateMember(editingMember.id, memberData);
      } else {
        // Add new member - need to generate ID and required fields
        const newMember: FamilyMember = {
          id: `member-${Date.now()}`,
          name: formData.name.trim(),
          nickname: formData.nickname.trim() || undefined,
          gender: formData.gender,
          birthDate: formData.birthDate,
          birthPlace: formData.birthPlace.trim() || undefined,
          isAlive: formData.isAlive,
          deathDate: !formData.isAlive ? formData.deathDate || undefined : undefined,
          generation: 1, // Default generation for new members
          maritalStatus: 'single' // Default marital status
        };
        addMember(newMember);
      }
      
      // Close modal and reset form
      handleClose();
      
    } catch (err) {
      console.error('Error saving member:', err);
      setError('Gagal menyimpan data anggota. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setFormData(initialFormData);
      setError('');
    }
  };

  const getModalTitle = () => {
    if (editingMember) return 'Edit Anggota Keluarga';
    if (isFirstMember) return 'Anggota Pertama Keluarga';
    return 'Tambah Anggota Keluarga';
  };

  const getModalSubtitle = () => {
    if (isFirstMember && familyTreeName) return familyTreeName;
    if (editingMember) return 'Ubah data anggota keluarga';
    return 'Masukkan data anggota baru';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{getModalTitle()}</h2>
              <p className="text-sm text-gray-500">{getModalSubtitle()}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* First Member Context */}
          {isFirstMember && (
            <div className="mb-6 text-center">
              <p className="text-gray-700 mb-4">
                Siapa yang akan menjadi <strong>"akar"</strong> family tree ini?
              </p>
            </div>
          )}

          <div className="space-y-6">
            {/* Basic Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Lengkap */}
              <div className="md:col-span-2">
                <label htmlFor="member-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  id="member-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    error && !formData.name.trim() ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Contoh: Ahmad Sutrisno, Siti Handayani"
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>

              {/* Nama Panggilan */}
              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Panggilan
                </label>
                <input
                  id="nickname"
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => updateFormData({ nickname: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama panggilan atau julukan"
                  disabled={isSubmitting}
                />
              </div>

              {/* Jenis Kelamin */}
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </legend>
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={(e) => updateFormData({ gender: e.target.value as 'male' | 'female' })}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-gray-700">Laki-laki</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={(e) => updateFormData({ gender: e.target.value as 'male' | 'female' })}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-gray-700">Perempuan</span>
                  </label>
                </div>
              </fieldset>

              {/* Tanggal Lahir */}
              <div>
                <label htmlFor="birth-date" className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Lahir
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="birth-date"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => updateFormData({ birthDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>
                
                {/* Birth year only checkbox removed - not in core data */}
              </div>

              {/* Tempat Lahir */}
              <div>
                <label htmlFor="birth-place" className="block text-sm font-medium text-gray-700 mb-2">
                  Tempat Lahir
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="birth-place"
                    type="text"
                    value={formData.birthPlace}
                    onChange={(e) => updateFormData({ birthPlace: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Kota/Kabupaten"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Status Hidup */}
              <fieldset className="md:col-span-2">
                <legend className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </legend>
                <div className="flex space-x-4 mb-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.isAlive}
                      onChange={() => updateFormData({ isAlive: true, deathDate: '' })}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-gray-700">Masih Hidup</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={!formData.isAlive}
                      onChange={() => updateFormData({ isAlive: false })}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-gray-700">Almarhum/Almarhumah</span>
                  </label>
                </div>

                {/* Tanggal Wafat */}
                {!formData.isAlive && (
                  <div>
                    <label htmlFor="death-date" className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Wafat
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="death-date"
                        type="date"
                        value={formData.deathDate}
                        onChange={(e) => updateFormData({ deathDate: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                )}
              </fieldset>

              {/* Role Selection - Only for First Member */}
              {isFirstMember && (
                <div className="md:col-span-2">
                  <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-3">
                      Sebagai:
                    </legend>
                    <div className="space-y-3">
                      {[
                        { value: 'myself', label: 'Diri saya sendiri', desc: 'Saya akan menjadi pusat family tree' },
                        { value: 'parent', label: 'Orang tua saya', desc: 'Ayah atau ibu sebagai akar keluarga' },
                        { value: 'grandparent', label: 'Kakek/nenek', desc: 'Generasi tertua yang diketahui' },
                        { value: 'other', label: 'Lainnya', desc: 'Anggota keluarga lainnya' }
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                            formData.role === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={option.value}
                            checked={formData.role === option.value}
                            onChange={(e) => updateFormData({ role: e.target.value as FormData['role'] })}
                            className="mt-1 text-blue-600 focus:ring-blue-500"
                            disabled={isSubmitting}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-500">{option.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                BATAL
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.name.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2 min-w-[120px] justify-center"
              >
                {isSubmitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>
                  {(() => {
                    if (isSubmitting) return 'MENYIMPAN...';
                    if (editingMember) return 'UPDATE';
                    return 'SIMPAN';
                  })()}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
