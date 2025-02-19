/**
 * @file components/common/ProfileMenu.tsx
 * @description ログインユーザーのプロフィール画像や名前を表示し、クリックするとドロップダウンメニューを開く例
 */

import React, { useState } from "react";

type MenuItem = {
  label: string;
  value: string;
};

type ProfileMenuProps = {
  userName: string;
  userAvatarUrl: string;
  menuItems: MenuItem[];
  onSelectMenuItem?: (itemValue: string) => void;
};

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  userName,
  userAvatarUrl,
  menuItems,
  onSelectMenuItem,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleSelect = (val: string) => {
    if (onSelectMenuItem) {
      onSelectMenuItem(val);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center space-x-2"
        onClick={handleToggle}
      >
        {userAvatarUrl ? (
          <img
            src={userAvatarUrl}
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <span className="w-8 h-8 bg-gray-300 rounded-full" />
        )}
        <span className="text-sm">{userName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
          {menuItems.map((item) => (
            <button
              key={item.value}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => handleSelect(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
