import React, { useState } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-sm font-medium">
              {user.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <button
            className="fixed inset-0 z-10 bg-transparent border-none cursor-default"
            aria-label="Tutup menu pengguna"
            onClick={() => setIsOpen(false)}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                setIsOpen(false);
              }
            }}
            style={{ outline: 'none' }}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="p-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            
            <div className="py-2">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Profil</span>
              </button>
              
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Pengaturan</span>
              </button>
              
              <hr className="my-2" />
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};