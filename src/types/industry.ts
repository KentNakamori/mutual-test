// src/types/enums.ts
// バックエンドのEnum定義と同期

/**
 * 業界・業種のEnum定義
 * バックエンドのIndustry Enumと同期
 */
export enum Industry {
  FINANCE = '金融',
  BANKS = '銀行',
  REAL_ESTATE = '不動産',
  RETAIL_TRADE = '小売',
  COMMERCIAL_WHOLESALE_TRADE = '商社・卸売',
  TRANSPORTATION_LOGISTICS = '運輸・物流',
  ELECTRIC_POWER_GAS = '電力ガス',
  IT_SERVICES = '情報通信・サービス',
  ELECTRONICS_PRECISION = '電機・精密',
  MACHINERY = '機械',
  STEEL_NONFERROUS = '鉄鋼・非鉄',
  AUTOMOBILES_TRANSPORTATION = '自動車・輸送機',
  PHARMACEUTICALS = '医薬品',
  MATERIALS_CHEMICALS = '素材・化学',
  CONSTRUCTION_MATERIALS = '建設・資材',
  ENERGY_RESOURCES = 'エネルギー資源',
  FOODS = '食品'
}

/**
 * 業界選択用のオプション配列
 * Enum値がそのまま日本語なので、valueとlabelが同じになります
 */
export const INDUSTRY_OPTIONS = Object.values(Industry).map((value) => ({
  value: value,
  label: value
}));

/**
 * 業界Enum値をそのまま返す関数（後方互換性のため）
 * 既にEnum値が日本語なので、変換の必要がありません
 */
export function getIndustryLabel(industry: Industry | string): string {
  return industry;
}

/**
 * 日本語表示名を業界Enum値に変換する関数
 * Enum値が既に日本語なので、そのまま返します
 */
export function getIndustryValue(label: string): Industry | undefined {
  return Object.values(Industry).find(value => value === label) as Industry | undefined;
} 