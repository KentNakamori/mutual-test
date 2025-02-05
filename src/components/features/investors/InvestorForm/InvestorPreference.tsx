import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

// 投資選好のカテゴリー定義
const INVESTMENT_CATEGORIES = [
  { id: 'stage', label: '投資ステージ', options: ['シード', 'アーリー', 'ミドル', 'レイター'] },
  { id: 'sector', label: '投資分野', options: ['IT', 'バイオ', 'フィンテック', 'AI/ML', 'SaaS', 'ハードウェア'] },
  { id: 'ticket', label: '投資金額', options: ['〜1000万円', '1000万円〜5000万円', '5000万円〜1億円', '1億円〜'] },
  { id: 'location', label: '投資地域', options: ['国内', '北米', 'アジア', 'ヨーロッパ'] }
];

interface InvestorPreferenceProps {
  preferences: Record<string, any>;
  onChange: (preferences: Record<string, any>) => void;
  errors?: Record<string, string>;
}

export const InvestorPreference: React.FC<InvestorPreferenceProps> = ({
  preferences,
  onChange,
  errors = {}
}) => {
  const [customCategory, setCustomCategory] = useState('');
  const [customOption, setCustomOption] = useState('');

  const handlePreferenceChange = (category: string, value: string[]) => {
    onChange({
      ...preferences,
      [category]: value
    });
  };

  const handleAddCustomOption = (category: string) => {
    if (customOption.trim()) {
      const currentValues = preferences[category] || [];
      handlePreferenceChange(category, [...currentValues, customOption.trim()]);
      setCustomOption('');
    }
  };

  const handleRemovePreference = (category: string, value: string) => {
    const currentValues = preferences[category] || [];
    handlePreferenceChange(
      category,
      currentValues.filter(v => v !== value)
    );
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold leading-relaxed">投資選好</h2>
        <p className="text-sm text-gray-500">投資家の投資に関する選好情報を設定してください</p>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-8">
          {/* 既定のカテゴリー */}
          {INVESTMENT_CATEGORIES.map(category => (
            <div key={category.id} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {category.label}
                </label>
                <div className="flex flex-wrap gap-2">
                  {category.options.map(option => (
                    <label
                      key={option}
                      className="inline-flex items-center"
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-black rounded border-gray-300 focus:ring-black"
                        checked={(preferences[category.id] || []).includes(option)}
                        onChange={(e) => {
                          const currentValues = preferences[category.id] || [];
                          if (e.target.checked) {
                            handlePreferenceChange(category.id, [...currentValues, option]);
                          } else {
                            handlePreferenceChange(
                              category.id,
                              currentValues.filter(v => v !== option)
                            );
                          }
                        }}
                      />
                      <span className="ml-2 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* カスタムオプション追加 */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="その他のオプションを追加"
                  value={category.id === customCategory ? customOption : ''}
                  onChange={(e) => {
                    setCustomCategory(category.id);
                    setCustomOption(e.target.value);
                  }}
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  onClick={() => handleAddCustomOption(category.id)}
                  className="px-4 py-2 text-sm text-white bg-black rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
                  disabled={!customOption.trim() || customCategory !== category.id}
                >
                  追加
                </button>
              </div>

              {/* 選択された項目のタグ表示 */}
              {(preferences[category.id] || []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(preferences[category.id] || []).map(value => (
                    <span
                      key={value}
                      className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 rounded-full"
                    >
                      {value}
                      <button
                        onClick={() => handleRemovePreference(category.id, value)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {errors[category.id] && (
                <p className="text-sm text-red-600">{errors[category.id]}</p>
              )}
            </div>
          ))}

          {/* 備考欄 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              その他の投資条件
            </label>
            <textarea
              value={preferences.notes || ''}
              onChange={(e) => onChange({ ...preferences, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="その他の投資条件や特記事項があれば入力してください"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestorPreference;