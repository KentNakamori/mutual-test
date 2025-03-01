/**
 * ProfileMenuコンポーネント
 * - ユーザー名やアバターを表示し、クリックするとshadcnのDropdownMenuで各種メニューを表示
 */

import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/shadcn/dropdown-menu"; // shadcn
import Image from "next/image";

type MenuItem = {
  label: string;
  value: string;
};

type ProfileMenuProps = {
  userName: string;
  userAvatarUrl?: string;
  menuItems: MenuItem[];
  onSelectMenuItem: (value: string) => void;
};

/**
 * ProfileMenu
 */
const ProfileMenu: React.FC<ProfileMenuProps> = ({
  userName,
  userAvatarUrl,
  menuItems,
  onSelectMenuItem,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center space-x-2 focus:outline-none"
          aria-label="Open user menu"
        >
          {/* アバター */}
          {userAvatarUrl ? (
            <Image
              src={userAvatarUrl}
              alt={userName}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
          )}
          <span className="text-sm font-medium text-gray-700">{userName}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-gray-500">
          Hello, {userName}
        </DropdownMenuLabel>
        <div className="py-1">
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onClick={() => onSelectMenuItem(item.value)}
              className="cursor-pointer"
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
