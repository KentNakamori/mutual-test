/**
 * SwitchToggleコンポーネント
 * - ON/OFFを切り替えるトグルUI。shadcnのSwitchをラップ
 */

import React from "react";
import { Switch as ShadcnSwitch } from "@/components/ui/shadcn/switch"; 
// ↑ 実際のshadcn Switch実装へのパスを調整してください

type SwitchToggleProps = {
  /** スイッチのON/OFF状態 */
  checked: boolean;
  /** 切り替え時のハンドラ */
  onChange: (checked: boolean) => void;
  /** ラベル(左側 or 右側に配置したい場合などはラップ側でコントロールしてもOK) */
  label?: string;
  /** スイッチを無効化するか */
  disabled?: boolean;
};

const SwitchToggle: React.FC<SwitchToggleProps> = ({
  checked,
  onChange,
  label,
  disabled,
}) => {
  return (
    <label className="inline-flex items-center space-x-2">
      {label && <span className="text-sm text-gray-700">{label}</span>}
      <ShadcnSwitch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </label>
  );
};

export default SwitchToggle;
