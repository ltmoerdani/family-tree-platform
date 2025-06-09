import React from 'react';
import { Check, User, Users, MapPin, Phone, Mail, Calendar, Briefcase } from 'lucide-react';
import { FormData } from '../AddMemberModal';
import { FamilyMember } from '@/types/family';

interface PreviewStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
  members: FamilyMember[];
}

export const PreviewStep: React.FC<PreviewStepProps> = ({
  formData,
  members
}) => {
  const selectedParents = members.filter(m => formData.parentIds.includes(m.id));
  const selectedSpouse = members.find(m => m.id === formData.spouseId);

  const calculateAge = () => {
    const birthYear = new Date(formData.birthDate).getFullYear();
    const currentYear = formData.isAlive ? new Date().getFullYear() : 
                       (formData.deathDate ? new Date(formData.deathDate).getFullYear() : new Date().getFullYear());
    return currentYear - birthYear;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Check className="w-12 h-12 text-green-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-gray-900">Preview Data</h3>
        <p className="text-sm text-gray-600">Periksa kembali data sebelum menyimpan</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
            {formData.photoUrl ? (
              <img
                src={formData.photoUrl}
                alt={formData.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center text-white text-2xl font-bold ${
                formData.gender === 'male' ? 'bg-blue-400' : 'bg-pink-400'
              }`}>
                {formData.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{formData.name}</h3>
            {formData.nickname && (
              <p className="text-gray-600">"{formData.nickname}"</p>
            )}
            <p className="text-sm text-gray-500">
              {calculateAge()} tahun • {formData.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Informasi Dasar
            </h4>
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Tanggal Lahir</p>
                <p className="font-medium">
                  {new Date(formData.birthDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {formData.birthPlace && (
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Tempat Lahir</p>
                  <p className="font-medium">{formData.birthPlace}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium">
                  {formData.isAlive ? 'Masih Hidup' : 'Almarhum/Almarhumah'}
                </p>
              </div>
            </div>

            {!formData.isAlive && formData.deathDate && (
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Tanggal Wafat</p>
                  <p className="font-medium">
                    {new Date(formData.deathDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Hubungan Keluarga
            </h4>

            {selectedParents.length > 0 && (
              <div className="flex items-start space-x-3">
                <Users className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Orang Tua</p>
                  <div className="space-y-1">
                    {selectedParents.map(parent => (
                      <p key={parent.id} className="font-medium">{parent.name}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedSpouse && (
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Pasangan</p>
                  <p className="font-medium">{selectedSpouse.name}</p>
                </div>
              </div>
            )}

            {formData.isAdopted && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">Anak Adopsi</p>
              </div>
            )}

            {formData.isHeadOfFamily && (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800 font-medium">Kepala Keluarga</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        {(formData.profession || formData.education || formData.currentLocation || formData.phone || formData.email) && (
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Informasi Tambahan</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.profession && (
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Profesi</p>
                    <p className="font-medium">{formData.profession}</p>
                  </div>
                </div>
              )}

              {formData.education && (
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Pendidikan</p>
                    <p className="font-medium">{formData.education}</p>
                  </div>
                </div>
              )}

              {formData.currentLocation && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Alamat</p>
                    <p className="font-medium">{formData.currentLocation}</p>
                  </div>
                </div>
              )}

              {formData.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Telepon</p>
                    <p className="font-medium">{formData.phone}</p>
                  </div>
                </div>
              )}

              {formData.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                </div>
              )}
            </div>

            {formData.notes && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Catatan</p>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{formData.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};