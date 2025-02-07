'use client'

import React from 'react';
import { Calendar, MessageSquare, Users, FileText, Settings } from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: <Users size={20} />, label: '投資家一覧', href: '/investors' },
  { icon: <Calendar size={20} />, label: '面談管理', href: '/investor-meetings' },
  { icon: <MessageSquare size={20} />, label: 'Q&A管理', href: '/qa' },
  { icon: <FileText size={20} />, label: 'ドキュメント', href: '/chat-board' },
  { icon: <Settings size={20} />, label: '設定', href: '/settings' },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-white border-r border-gray-200 w-64 h-screen fixed left-0 top-0 pt-16">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;