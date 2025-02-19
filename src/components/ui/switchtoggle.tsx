/**
 * @file components/ui/SwitchToggle.tsx
 * @description ON/OFFの二択を切り替えるスイッチUI
 */
import React from "react";
import { Switch as ShadcnSwitch } from "@/components/ui/switch";

type SwitchToggleProps = {
  checked: boolean;
  onChange: (newVal: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
};

const SwitchToggle: React.FC<SwitchToggleProps> = ({
  checked,
  onChange,
  disabled,
  label,
  size = "md",
}) => {
  const handleToggle = (val: boolean) => {
    onChange(val);
  };

  const sizeClass = size === "sm" ? "h-4 w-8" : size === "lg" ? "h-6 w-12" : "h-5 w-10";

  return (
    <label className="flex items-center space-x-2">
      <ShadcnSwitch
        checked={checked}
        onCheckedChange={handleToggle}
        disabled={disabled}
        className={sizeClass}
      />
      {label && <span>{label}</span>}
    </label>
  );
};

export default SwitchToggle;
