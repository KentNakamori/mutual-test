// src/components/features/corporate/SettingsTabs.tsx
"use client";

import React, { useState } from 'react';
import Tabs from '../../../ui/Tabs';
import CompanyInfoForm from './CompanyInfoForm';
import AccountSettingsForm from './AccountSettingsForm';
import LogoutButton from './LogoutButton';
import { CompanyInfo } from '../../../../types';

export interface SettingsTabsProps {
  companyInfo: CompanyInfo;
  refetchCompanyInfo: () => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ companyInfo, refetchCompanyInfo }) => {
  const [activeTab, setActiveTab] = useState('company');

  // 各タブの内容（shadcn等のTabsコンポーネント利用）
  const tabs = [
    {
      id: 'company',
      label: '企業情報',
      content: <CompanyInfoForm initialData={companyInfo} onSaveSuccess={refetchCompanyInfo} />,
    },
    {
      id: 'account',
      label: 'アカウント設定',
      content: <AccountSettingsForm />,
    },
    {
      id: 'logout',
      label: 'ログアウト',
      content: <LogoutButton />,
    },
  ];

  return (
    <div>
      <Tabs tabs={tabs} activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
};

export default SettingsTabs;
