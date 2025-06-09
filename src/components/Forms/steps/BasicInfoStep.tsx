import React from 'react';
import { Calendar, MapPin, User } from 'lucide-react';
import { FormData } from '../AddMemberModal';

interface BasicInfoStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <User className="w-12 h-12 text-blue-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-gray-900">Informasi Dasar</h3>
        <p className="text-sm text-gray-600">Masukkan data dasar anggota keluarga</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nama Lengkap */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan nama lengkap"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Nama Panggilan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Panggilan
          </label>
          <input
            type="text"
            value={formData.nickname}
            onChange={(e) => updateFormData({ nickname: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Nama panggilan"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jenis Kelamin <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="male"
                checked={formData.gender === 'male'}
                onChange={(e) => updateFormData({ gender: e.target.value as 'male' | 'female' })}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Laki-laki</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="female"
                checked={formData.gender === 'female'}
                onChange={(e) => updateFormData({ gender: e.target.value as 'male' | 'female' })}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Perempuan</span>
            </label>
          </div>
        </div>

        {/* Tanggal Lahir */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal Lahir <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => updateFormData({ birthDate: e.target.value })}
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                errors.birthDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.birthDate && (
            <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
          )}
          
          <label className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={formData.onlyBirthYear}
              onChange={(e) => updateFormData({ onlyBirthYear: e.target.checked })}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Hanya tahun lahir</span>
          </label>
        </div>

        {/* Tempat Lahir */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tempat Lahir
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={formData.birthPlace}
              onChange={(e) => updateFormData({ birthPlace: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Kota/Kabupaten"
            />
          </div>
        </div>

        {/* Status Hidup */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="true"
                checked={formData.isAlive}
                onChange={() => updateFormData({ isAlive: true, deathDate: '' })}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Masih Hidup</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="false"
                checked={!formData.isAlive}
                onChange={() => updateFormData({ isAlive: false })}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Almarhum/Almarhumah</span>
            </label>
          </div>

          {/* Tanggal Wafat */}
          {!formData.isAlive && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Wafat
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.deathDate}
                  onChange={(e) => updateFormData({ deathDate: e.target.value })}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                    errors.deathDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.deathDate && (
                <p className="mt-1 text-sm text-red-600">{errors.deathDate}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};