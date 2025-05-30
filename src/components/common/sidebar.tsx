// src/components/common/sidebar.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { FaBars, FaAngleDoubleLeft, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { SidebarMenuItem, SidebarProps } from '@/types';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';

interface ExtendedSidebarProps extends SidebarProps {
  defaultCollapsed?: boolean;
}

/**
 * Sidebar コンポーネント
 * 
 * このコンポーネントは以下の機能を提供します：
 * - サイドバーナビゲーション
 *   - 折りたたみ可能なメニュー
 *   - アイコンとラベルの表示
 *   - 選択状態の視覚的フィードバック
 *   - ログアウト機能
 * 
 * 主な機能：
 * - サイドバーの展開/折りたたみ
 * - メニュー項目の選択
 * - レスポンシブデザイン
 * - アニメーション付きの遷移
 * - Auth0ログアウト
 * 
 * @component
 * @param {SidebarProps} props - サイドバーのプロパティ
 * @param {Array<SidebarMenuItem>} props.menuItems - メニュー項目の配列
 * @param {boolean} [props.isCollapsible=true] - サイドバーを折りたたみ可能かどうか
 * @param {string} [props.selectedItem] - 現在選択されているメニュー項目のリンク
 * @param {(link: string) => void} [props.onSelectMenuItem] - メニュー項目選択時のコールバック関数
 * @param {boolean} [props.defaultCollapsed=false] - デフォルトで折りたたまれた状態かどうか
 * @returns {JSX.Element} サイドバーナビゲーションコンポーネント
 */
const Sidebar: React.FC<ExtendedSidebarProps> = ({
  menuItems,
  isCollapsible,
  selectedItem,
  onSelectMenuItem,
  defaultCollapsed = false,
}) => {
  const [isOpen, setIsOpen] = useState(!defaultCollapsed);
  const router = useRouter();
  const { user, isLoading } = useUser();

  const handleToggleSidebar = () => {
    if (isCollapsible !== false) {
      setIsOpen(!isOpen);
    }
  };

  const handleLogout = () => {
    // Auth0のログアウトフローを使用
    router.push('/auth/logout');
  };

  const handleLogin = () => {
    // 現在のURLをreturnToパラメータとして渡してAuth0のログイン画面に遷移
    const returnTo = typeof window !== 'undefined' ? window.location.pathname : '/investor/companies';
    router.push(`/api/auth/investor-login?returnTo=${encodeURIComponent(returnTo)}`);
  };

  return (
    <aside
      className={`
        bg-white text-gray-700 p-2
        ${isOpen ? 'w-64' : 'w-16'}
        transition-all duration-300 ease-in-out
        flex-shrink-0 flex flex-col
        border-r border-gray-200
        h-screen sticky top-0 left-0
      `}
    >
      {/* ロゴまたはトグルボタン */}
      <div className="flex items-center justify-center mb-4 h-12">
        {isOpen ? (
          <>
            <button
              className="p-1 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={handleToggleSidebar}
            >
              <FaAngleDoubleLeft size={20} />
            </button>
            <div className="flex-1 flex justify-center">
              <Image
                src="/images/qa-station-logo.png"
                alt="QA Station Logo"
                width={160}
                height={40}
                priority
              />
            </div>
          </>
        ) : (
          <button
            className="p-1 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={handleToggleSidebar}
          >
            <FaBars size={20} />
          </button>
        )}
      </div>

      {/* メニュー項目 */}
      <ul className="space-y-2 flex-grow">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors ${
              selectedItem === item.link ? 'border-l-4 border-blue-500 bg-gray-50' : ''
            }`}
            onClick={() => onSelectMenuItem && onSelectMenuItem(item.link)}
          >
            <div className={`flex items-center h-10 ${isOpen ? 'space-x-2' : 'justify-center'}`}>
              {item.icon && <span className={`flex-shrink-0 ${selectedItem === item.link ? 'text-blue-500' : ''}`}>{item.icon}</span>}
              {isOpen && <span className={`truncate ${selectedItem === item.link ? 'text-blue-500 font-medium' : ''}`}>{item.label}</span>}
            </div>
          </li>
        ))}
      </ul>

      {/* ログアウト/ログインボタン */}
      {!isLoading && (
        <div className="mt-auto pt-2 border-t border-gray-200">
          {user ? (
            <button
              className="w-full p-2 rounded hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors group"
              onClick={handleLogout}
            >
              <div className={`flex items-center h-10 ${isOpen ? 'space-x-2' : 'justify-center'}`}>
                <FaSignOutAlt className="flex-shrink-0 group-hover:text-red-600" size={20} />
                {isOpen && <span className="truncate group-hover:text-red-600">ログアウト</span>}
              </div>
            </button>
          ) : (
            <button
              className="w-full p-2 rounded hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors group"
              onClick={handleLogin}
            >
              <div className={`flex items-center h-10 ${isOpen ? 'space-x-2' : 'justify-center'}`}>
                <FaSignInAlt className="flex-shrink-0 group-hover:text-blue-600" size={20} />
                {isOpen && <span className="truncate group-hover:text-blue-600">ログイン</span>}
              </div>
            </button>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
