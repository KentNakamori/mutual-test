// src/components/features/corporate/settings/SettingsTabs.tsx
"use client";

import React from 'react';
import CompanyInfoForm from './CompanyInfoForm';
import { SettingsTabsProps} from '../../../../types';

const SettingsTabs: React.FC<SettingsTabsProps> = ({ companyInfo, refetchCompanyInfo }) => {
  return (
    <div>
      <CompanyInfoForm initialData={companyInfo} onSaveSuccess={refetchCompanyInfo} />
    </div>
  );
};

export default SettingsTabs;
