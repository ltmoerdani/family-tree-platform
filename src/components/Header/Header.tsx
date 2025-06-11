import React from 'react';
import { Search, Menu, TreePine } from 'lucide-react';
import { useFamilyStore } from '../../store/familyStore';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  onMenuToggle: () => void;
  familyName: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, familyName }) => {
  const { searchQuery, setSearchQuery } = useFamilyStore();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-2">
          <TreePine className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            FamilyTree
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
          <span>Dashboard</span>
          <span>/</span>
          <span>Family Tree</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{familyName}</span>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari anggota keluarga..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <UserMenu />
      </div>
    </header>
  );
};