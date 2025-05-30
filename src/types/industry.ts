// src/types/enums.ts
// バックエンドのEnum定義と同期

/**
 * 業界・業種のEnum定義
 * バックエンドのIndustry Enumと同期
 */
export enum Industry {
  FINANCE = 'FINANCE',
  BANKS = 'BANKS',
  REAL_ESTATE = 'REAL_ESTATE',
  RETAIL_TRADE = 'RETAIL_TRADE',
  COMMERCIAL_WHOLESALE_TRADE = 'COMMERCIAL_WHOLESALE_TRADE',
  TRANSPORTATION_LOGISTICS = 'TRANSPORTATION_LOGISTICS',
  ELECTRIC_POWER_GAS = 'ELECTRIC_POWER_GAS',
  IT_SERVICES = 'IT_SERVICES',
  ELECTRONICS_PRECISION = 'ELECTRONICS_PRECISION',
  MACHINERY = 'MACHINERY',
  STEEL_NONFERROUS = 'STEEL_NONFERROUS',
  AUTOMOBILES_TRANSPORTATION = 'AUTOMOBILES_TRANSPORTATION',
  PHARMACEUTICALS = 'PHARMACEUTICALS',
  MATERIALS_CHEMICALS = 'MATERIALS_CHEMICALS',
  CONSTRUCTION_MATERIALS = 'CONSTRUCTION_MATERIALS',
  ENERGY_RESOURCES = 'ENERGY_RESOURCES',
  FOODS = 'FOODS'
}

/**
 * 業界Enum値から日本語表示名への変換マップ
 */
export const INDUSTRY_LABELS: Record<Industry, string> = {
  [Industry.FINANCE]: '金融',
  [Industry.BANKS]: '銀行',
  [Industry.REAL_ESTATE]: '不動産',
  [Industry.RETAIL_TRADE]: '小売',
  [Industry.COMMERCIAL_WHOLESALE_TRADE]: '商社・卸売',
  [Industry.TRANSPORTATION_LOGISTICS]: '運輸・物流',
  [Industry.ELECTRIC_POWER_GAS]: '電力ガス',
  [Industry.IT_SERVICES]: '情報通信・サービス',
  [Industry.ELECTRONICS_PRECISION]: '電機・精密',
  [Industry.MACHINERY]: '機械',
  [Industry.STEEL_NONFERROUS]: '鉄鋼・非鉄',
  [Industry.AUTOMOBILES_TRANSPORTATION]: '自動車・輸送機',
  [Industry.PHARMACEUTICALS]: '医薬品',
  [Industry.MATERIALS_CHEMICALS]: '素材・化学',
  [Industry.CONSTRUCTION_MATERIALS]: '建設・資材',
  [Industry.ENERGY_RESOURCES]: 'エネルギー資源',
  [Industry.FOODS]: '食品'
};

/**
 * 日本語表示名からEnum値への変換マップ
 */
export const INDUSTRY_VALUES: Record<string, Industry> = Object.fromEntries(
  Object.entries(INDUSTRY_LABELS).map(([key, value]) => [value, key as Industry])
);

/**
 * 業界選択用のオプション配列
 */
export const INDUSTRY_OPTIONS = Object.entries(INDUSTRY_LABELS).map(([value, label]) => ({
  value: value as Industry,
  label
}));

/**
 * 業界Enum値を日本語表示名に変換する関数
 */
export function getIndustryLabel(industry: Industry | string): string {
  if (typeof industry === 'string') {
    return INDUSTRY_LABELS[industry as Industry] || industry;
  }
  return INDUSTRY_LABELS[industry] || industry;
}

/**
 * 日本語表示名を業界Enum値に変換する関数
 */
export function getIndustryValue(label: string): Industry | undefined {
  return INDUSTRY_VALUES[label];
} 