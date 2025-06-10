import React, { useState, useEffect } from 'react';
import { X, User, Calendar, MapPin, Briefcase, Phone } from 'lucide-react';
import { FamilyMember } from '../../../types/family';

interface MemberEditModalProps {
  member: FamilyMember;
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: FamilyMember) => void;
}

export const MemberEditModal: React.FC<MemberEditModalProps> = ({
  member,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<FamilyMember>(member);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData(member);
      setErrors({});
    }
  }, [member, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama harus diisi';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Tanggal lahir harus diisi';
    }

    if (!formData.birthPlace?.trim()) {
      newErrors.birthPlace = 'Tempat lahir harus diisi';
    }

    if (!formData.gender) {
      newErrors.gender = 'Jenis kelamin harus dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: keyof FamilyMember, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Profil Anggota
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Tutup modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label htmlFor="member-name" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap *
              </label>
              <input
                id="member-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Masukkan nama lengkap"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Nickname */}
            <div>
              <label htmlFor="member-nickname" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Panggilan
              </label>
              <input
                id="member-nickname"
                type="text"
                value={formData.nickname ?? ''}
                onChange={(e) => handleInputChange('nickname', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nama panggilan sehari-hari"
              />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="member-gender" className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kelamin *
              </label>
              <select
                id="member-gender"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
              )}
            </div>

            {/* Generation */}
            <div>
              <label htmlFor="member-generation" className="block text-sm font-medium text-gray-700 mb-1">
                Generasi
              </label>
              <input
                id="member-generation"
                type="number"
                min="1"
                max="10"
                value={formData.generation}
                onChange={(e) => handleInputChange('generation', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Birth Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Informasi Kelahiran
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="member-birth-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Lahir *
                </label>
                <input
                  id="member-birth-date"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.birthDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="member-birth-place" className="block text-sm font-medium text-gray-700 mb-1">
                  Tempat Lahir *
                </label>
                <input
                  id="member-birth-place"
                  type="text"
                  value={formData.birthPlace ?? ''}
                  onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.birthPlace ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Kota/tempat kelahiran"
                />
                {errors.birthPlace && (
                  <p className="mt-1 text-sm text-red-600">{errors.birthPlace}</p>
                )}
              </div>
            </div>
          </div>

          {/* Life Status */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <input
                  id="member-alive"
                  type="checkbox"
                  checked={formData.isAlive}
                  onChange={(e) => handleInputChange('isAlive', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="member-alive" className="ml-2 text-sm font-medium text-gray-700">
                  Masih hidup
                </label>
              </div>
            </div>

            {!formData.isAlive && (
              <div>
                <label htmlFor="member-death-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Wafat
                </label>
                <input
                  id="member-death-date"
                  type="date"
                  value={formData.deathDate ?? ''}
                  onChange={(e) => handleInputChange('deathDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
                />
              </div>
            )}
          </div>

          {/* Professional Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
              Informasi Profesi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="member-profession" className="block text-sm font-medium text-gray-700 mb-1">
                  Profesi/Pekerjaan
                </label>
                <input
                  id="member-profession"
                  type="text"
                  value={formData.profession ?? ''}
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Pekerjaan atau profesi"
                />
              </div>

              <div>
                <label htmlFor="member-education" className="block text-sm font-medium text-gray-700 mb-1">
                  Pendidikan
                </label>
                <input
                  id="member-education"
                  type="text"
                  value={formData.education ?? ''}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Pendidikan terakhir"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Informasi Lokasi
            </h3>
            <div>
              <label htmlFor="member-location" className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi Saat Ini
              </label>
              <input
                id="member-location"
                type="text"
                value={formData.currentLocation ?? ''}
                onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Kota/daerah tempat tinggal saat ini"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-blue-600" />
              Informasi Kontak
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="member-phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon
                </label>
                <input
                  id="member-phone"
                  type="tel"
                  value={formData.phone ?? ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+62812345678"
                />
              </div>

              <div>
                <label htmlFor="member-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="member-email"
                  type="email"
                  value={formData.email ?? ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="nama@email.com"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};