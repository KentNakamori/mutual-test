import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
}) => {
  return (
    <div className="pb-6 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold leading-relaxed">
            {title}
          </h1>
          {description && (
            <p className="text-base text-gray-500">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;