import React from 'react';
import { Users, TreePine, MapPin } from 'lucide-react';
import { useFamilyStore } from '../../store/familyStore';

export const StatsSidebar: React.FC = () => {
  const { stats } = useFamilyStore();

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Statistik Keluarga</h2>
      
      {/* Overview Stats */}
      <div className="space-y-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Anggota</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalMembers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <TreePine className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Generasi</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalGenerations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gender Distribution */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Gender</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">♂</div>
            <div className="text-2xl font-bold text-blue-600">{stats.maleCount}</div>
            <div className="text-sm text-gray-600">Laki-laki</div>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-pink-600 mb-1">♀</div>
            <div className="text-2xl font-bold text-pink-600">{stats.femaleCount}</div>
            <div className="text-sm text-gray-600">Perempuan</div>
          </div>
        </div>
      </div>

      {/* Age Distribution */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sebaran Usia</h3>
        <div className="space-y-3">
          {Object.entries(stats.ageDistribution).map(([range, count]) => (
            <div key={range} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{range} tahun</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Location Distribution */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lokasi</h3>
        <div className="space-y-3">
          {Object.entries(stats.locationDistribution).map(([location, count]) => (
            <div key={location} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{location}</span>
              </div>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};