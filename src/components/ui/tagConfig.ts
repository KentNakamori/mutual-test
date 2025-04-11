// /components/ui/tagConfig.ts 
// タグ追加の際はここへオブジェクトを1つ追加するだけでOK
import{ TagOption } from '@/types';


  
  // 情報ソース
  export const INFO_SOURCE_OPTIONS: TagOption[] = [
    { label: '決算説明会', color: 'bg-purple-100 text-purple-800' },
    { label: '有価証券報告書', color: 'bg-purple-100 text-purple-800' },
    { label: '決算説明動画', color: 'bg-purple-100 text-purple-800' },
  ];
  
  // ジャンル
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
    const allOptions = [...INFO_SOURCE_OPTIONS, ...GENRE_OPTIONS];
    const found = allOptions.find((option) => option.label === label);
    return found ? found.color : 'bg-gray-300';
  }