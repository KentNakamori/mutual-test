// /components/ui/tagConfig.ts 
// タグ追加の際はここへオブジェクトを1つ追加するだけでOK
import{ TagOption } from '@/types';

// 質問ルート
export const QUESTION_ROUTE_OPTIONS: TagOption[] = [
  { label: '決算説明会', color: 'bg-blue-100 text-blue-800' },
  { label: '個人投資家説明会', color: 'bg-green-100 text-green-800' },
  { label: 'IR面談', color: 'bg-yellow-100 text-yellow-800' },
  { label: '問い合わせ', color: 'bg-pink-100 text-pink-800' },
  { label: 'FAQ', color: 'bg-purple-100 text-purple-800' },
  { label: 'その他', color: 'bg-gray-100 text-gray-800' },
];
  
// 情報ソース
export const INFO_SOURCE_OPTIONS: TagOption[] = [
  { label: '決算説明会資料', color: 'bg-red-100 text-red-800' },
  { label: '有価証券報告書', color: 'bg-orange-100 text-orange-800' },
  { label: '決算短信', color: 'bg-emerald-100 text-emerald-800' },
  { label: '決算説明会の書き起こし', color: 'bg-violet-100 text-violet-800' },
  { label: 'その他', color: 'bg-gray-100 text-gray-800' },
];
  
// カテゴリ
export const GENRE_OPTIONS: TagOption[] = [
  { label: '業績', color: 'bg-amber-100 text-amber-800' },
  { label: '事業戦略', color: 'bg-blue-100 text-blue-800' },
  { label: '事業内容', color: 'bg-cyan-100 text-cyan-800' },
  { label: 'M&A', color: 'bg-teal-100 text-teal-800' },
  { label: '外部環境', color: 'bg-red-100 text-red-800' },
  { label: '人材戦略', color: 'bg-orange-100 text-orange-800' },
  { label: 'その他', color: 'bg-gray-100 text-gray-800' },
];

/**
 * タグ名から対応する背景色クラスを取得します。
 * 該当するタグがなければ、デフォルトの色 (bg-gray-300) を返します。
 *
 * @param label - タグのラベル
 * @returns Tailwind CSS の背景色クラス
 */
export function getTagColor(label: string): string {
  const allOptions = [...QUESTION_ROUTE_OPTIONS, ...INFO_SOURCE_OPTIONS, ...GENRE_OPTIONS];
  const found = allOptions.find((option) => option.label === label);
  return found ? found.color : 'bg-gray-300';
}