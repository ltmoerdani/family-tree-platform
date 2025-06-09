import React, { useRef } from 'react';
import { FileText, Briefcase, GraduationCap, MapPin, Phone, Mail, Camera } from 'lucide-react';
import { FormData } from '../AddMemberModal';

interface DetailInfoStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
}

export const DetailInfoStep: React.FC<DetailInfoStepProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Format file harus JPG atau PNG');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        updateFormData({ 
          photoFile: file, 
          photoUrl: e.target?.result as string 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      // Handle the file directly instead of creating a synthetic event
      // Validate file
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Format file harus JPG atau PNG');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        updateFormData({ 
          photoFile: file, 
          photoUrl: readerEvent.target?.result as string 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <FileText className="w-12 h-12 text-blue-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-gray-900">Informasi Detail</h3>
        <p className="text-sm text-gray-600">Tambahkan informasi tambahan (opsional)</p>
      </div>

      {/* Photo Upload */}
      <div>
        <label htmlFor="photo-upload" className="block text-sm font-medium text-gray-700 mb-3">
          Foto Profil
        </label>
        <button
          type="button"
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload foto profil dengan drag and drop atau klik untuk browse"
        >
          {formData.photoUrl ? (
            <div className="space-y-3">
              <img
                src={formData.photoUrl}
                alt="Preview foto profil"
                className="w-24 h-24 rounded-full mx-auto object-cover"
              />
              <p className="text-sm text-gray-600">Klik untuk mengganti foto</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Camera className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-sm text-gray-600">
                  Drag & drop foto atau <span className="text-blue-600 font-medium">browse</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG maksimal 5MB. Rekomendasi 300x300px
                </p>
              </div>
            </div>
          )}
        </button>
        <input
          id="photo-upload"
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileSelect}
          className="hidden"
          aria-describedby="photo-help"
        />
        <p id="photo-help" className="sr-only">
          Upload foto profil dalam format JPG atau PNG dengan ukuran maksimal 5MB
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profesi */}
        <div>
          <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
            Profesi
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="profession"
              type="text"
              value={formData.profession}
              onChange={(e) => updateFormData({ profession: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Pekerjaan/Profesi"
            />
          </div>
        </div>

        {/* Pendidikan */}
        <div>
          <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
            Pendidikan
          </label>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              id="education"
              value={formData.education}
              onChange={(e) => updateFormData({ education: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih pendidikan</option>
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
              <option value="D3">D3</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
            </select>
          </div>
        </div>

        {/* Alamat */}
        <div className="md:col-span-2">
          <label htmlFor="current-location" className="block text-sm font-medium text-gray-700 mb-2">
            Alamat Lengkap
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              id="current-location"
              value={formData.currentLocation}
              onChange={(e) => updateFormData({ currentLocation: e.target.value })}
              rows={3}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Alamat lengkap tempat tinggal saat ini"
            />
          </div>
        </div>

        {/* Nomor Telepon */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Nomor Telepon
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+62812345678"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="email@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Social Media */}
        <div>
          <label htmlFor="social-media" className="block text-sm font-medium text-gray-700 mb-2">
            Media Sosial
          </label>
          <input
            id="social-media"
            type="text"
            value={formData.socialMedia}
            onChange={(e) => updateFormData({ socialMedia: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Instagram, Facebook, dll"
          />
        </div>

        {/* Catatan */}
        <div className="md:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Catatan Khusus
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => updateFormData({ notes: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Catatan tambahan, hobi, prestasi, dll"
          />
        </div>
      </div>
    </div>
  );
};