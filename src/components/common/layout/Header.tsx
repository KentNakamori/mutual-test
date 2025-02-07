'use client'

import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">IR Dashboard</h1>
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="検索..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-full">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium hidden md:block">管理者</span>
            <button className="p-1.5 hover:bg-gray-100 rounded-full">
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
