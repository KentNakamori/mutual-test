// src/components/features/investor/companies/CompanyListing.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Filter, Search, ChevronDown, Lock } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Industry, INDUSTRY_OPTIONS, getIndustryLabel } from '@/types/industry';
import { useUser } from '@auth0/nextjs-auth0';
import { getFullImageUrl } from '@/lib/utils/imageUtils';//画像のURLを取得する関数仮
import { getInvestorCompanies } from '@/lib/api/investor'; // getInvestorCompaniesをインポート
import GuestRestrictedContent from '@/components/features/investor/common/GuestRestrictedContent';

// APIレスポンスの型定義
interface CompanyItem {
  companyId: string;
  companyName: string;
  industry: Industry;
  logoUrl?: string;
  isFollowed: boolean;
  createdAt: string;
  updatedAt: string;
  securitiesCode?: string;      // 証券コード
  majorStockExchange?: string;  // 主要取引所
  websiteUrl?: string;         // WebサイトURL
  businessDescription?: string; // 企業説明
}

interface CompanyListResponse {
  companies: CompanyItem[];
  totalCount: number;
  totalPages: number;
}

interface CompanyListingProps {
  isFollowedOnly?: boolean;
  onCompaniesLoaded?: (companies: Array<{ companyId: string }>) => void;
}

const CompanyListing: React.FC<CompanyListingProps> = ({ isFollowedOnly = false, onCompaniesLoaded }) => {
  const { user, error: userError, isLoading: userLoading } = useUser();
  // ゲスト判定: ユーザーがいない、ローディングが終了
  const isGuest = !user && !userLoading;
  const token = user?.sub; // user.subをトークンとして使用

  // フィルター要素のref
  const industryFilterRef = useRef<HTMLDivElement>(null);
  const exchangeFilterRef = useRef<HTMLDivElement>(null);
  const sortFilterRef = useRef<HTMLDivElement>(null);
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showIndustryFilter, setShowIndustryFilter] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [activeIndustry, setActiveIndustry] = useState<Industry | 'すべて'>('すべて');
  const [activeSortOption, setActiveSortOption] = useState('新着順');
  const [showExchangeFilter, setShowExchangeFilter] = useState(false);
  const [activeExchange, setActiveExchange] = useState('すべて');
  const [keyword, setKeyword] = useState('');
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  
  // フィルター外クリックでフィルターを閉じる
  useEffect(() => {
    console.log('useEffect実行 - イベントリスナー設定:', {
      showIndustryFilter,
      showExchangeFilter,
      showSortOptions
    });

    const handleClickOutside = (event: MouseEvent) => {
      console.log('=== クリックイベント発生 ===');
      const target = event.target as Node;
      
      console.log('外部クリック検知:', {
        showIndustryFilter,
        showExchangeFilter,
        showSortOptions,
        targetElement: target,
        clickedElement: (target as Element)?.tagName,
        clickedClass: (target as Element)?.className,
        eventType: event.type
      });
      
      // 業界フィルターの外側をクリックした場合
      if (showIndustryFilter && industryFilterRef.current && !industryFilterRef.current.contains(target)) {
        console.log('業界フィルターを閉じます');
        setShowIndustryFilter(false);
      }
      
      // 取引所フィルターの外側をクリックした場合
      if (showExchangeFilter && exchangeFilterRef.current && !exchangeFilterRef.current.contains(target)) {
        console.log('取引所フィルターを閉じます');
        setShowExchangeFilter(false);
      }
      
      // ソートフィルターの外側をクリックした場合
      if (showSortOptions && sortFilterRef.current && !sortFilterRef.current.contains(target)) {
        console.log('ソートフィルターを閉じます');
        setShowSortOptions(false);
      }
    };

    // ドキュメントにイベントリスナーを追加
    console.log('イベントリスナーを追加します');
    document.addEventListener('click', handleClickOutside);
    
    // クリーンアップ関数
    return () => {
      console.log('イベントリスナーを削除します');
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showIndustryFilter, showExchangeFilter, showSortOptions]);
  
  // APIからデータ取得
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 認証状態がロード中の場合は何もしない
        if (userLoading) return;

        const data = await getInvestorCompanies(token); // 修正: getInvestorCompaniesを使用
        
        console.log('取得した企業データ:', data);
        
        const companiesList = data.companies || [];
        
        const filteredData = isFollowedOnly 
          ? companiesList.filter((company: CompanyItem) => company.isFollowed === true)
          : companiesList;
        
        setCompanies(filteredData);
        
        if (onCompaniesLoaded) {
          onCompaniesLoaded(filteredData.map((company: CompanyItem) => ({ companyId: company.companyId })));
        }
      } catch (err) {
        console.error('企業データ取得エラー:', err);
        setError(err instanceof Error ? err.message : '企業データの取得に失敗しました');
        if (onCompaniesLoaded) {
          onCompaniesLoaded([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [isFollowedOnly, onCompaniesLoaded, userLoading, token]); // 依存配列にuserLoadingとtokenを追加
  
  // フィルターとソートのオプション
  const industries = ['すべて', ...INDUSTRY_OPTIONS.map(option => option.value)];
  const exchanges = ['すべて', '東証プライム', '東証スタンダード', '東証グロース'];
  const sortOptions = ['新着順', '名前順 (A-Z)', '名前順 (Z-A)'];
  
  // フィルター適用とソート処理
  const getFilteredAndSortedCompanies = () => {
    let filtered = [...companies];
    
    // キーワード検索フィルター
    if (keyword.trim()) {
      filtered = filtered.filter(company => 
        company.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
        (company.businessDescription && company.businessDescription.toLowerCase().includes(keyword.toLowerCase()))
      );
    }
    
    // 業界フィルター
    if (activeIndustry !== 'すべて') {
      const targetIndustryLabel = getIndustryLabel(activeIndustry); // Enum値を日本語ラベルに変換
      filtered = filtered.filter(company => {
        return company.industry === targetIndustryLabel;
      });
    }
    
    // 主要取引所フィルター（ローカルフィルタリング）
    if (activeExchange !== 'すべて') {
      filtered = filtered.filter(company => 
        company.majorStockExchange === activeExchange
      );
    }
    
    // ソート処理
    switch (activeSortOption) {
      case '新着順':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case '名前順 (A-Z)':
        filtered.sort((a, b) => a.companyName.localeCompare(b.companyName, 'ja'));
        break;
      case '名前順 (Z-A)':
        filtered.sort((a, b) => b.companyName.localeCompare(a.companyName, 'ja'));
        break;
      default:
        break;
    }
    
    return filtered;
  };
  
  const filteredCompanies = getFilteredAndSortedCompanies();
  
  // フォロー切り替え処理
  const handleFollowToggle = async (companyId: string, currentFollowStatus: boolean) => {
    if (isGuest) {
      setShowGuestPopup(true);
      return;
    }

    try {
      // バックエンドの実装に合わせて全てPOSTメソッドを使用
      const response = await fetch(`/api/proxy/investor/companies/${companyId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: currentFollowStatus ? 'unfollow' : 'follow' 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'フォロー操作に失敗しました');
      }

      const data = await response.json();

      // 企業リストを更新
      setCompanies(prevCompanies =>
        prevCompanies.map(company =>
          company.companyId === companyId
            ? { ...company, isFollowed: data.isFollowed }
            : company
        )
      );
      
      console.log(data.message);
    } catch (err) {
      console.error('フォロー操作に失敗しました', err);
      alert(`フォロー操作に失敗しました: ${err instanceof Error ? err.message : '不明なエラー'}`);
    }
  };
  
  // 検索実行
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // useEffectのトリガー（APIリクエスト）
  };
  
  // フィルターリセット
  const handleResetFilters = () => {
    setActiveIndustry('すべて');
    setActiveExchange('すべて');
    setActiveSortOption('新着順');
    setKeyword('');
  };
  
  return (
    <div>
      {/* 検索・フィルター・並び替えエリア */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* 検索バー */}
        <form onSubmit={handleSearch} className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="企業名・キーワードで検索" 
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </form>
        
        {/* 業界フィルター */}
        <div className="relative" ref={industryFilterRef}>
          <button 
            onClick={() => {
              setShowIndustryFilter(!showIndustryFilter);
              if (showExchangeFilter) setShowExchangeFilter(false);
              if (showSortOptions) setShowSortOptions(false);
            }}
            className="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span>業界: {activeIndustry === 'すべて' ? 'すべて' : getIndustryLabel(activeIndustry)}</span>
            <ChevronDown size={16} className="ml-2 text-gray-500" />
          </button>
      
          {showIndustryFilter && (
            <div 
              className="absolute z-[60] mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 max-h-60 overflow-y-auto"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <button
                onClick={() => {
                  setActiveIndustry('すべて');
                  setShowIndustryFilter(false);
                }}
                className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                  activeIndustry === 'すべて' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                }`}
              >
                すべて
              </button>
              {INDUSTRY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setActiveIndustry(option.value);
                    setShowIndustryFilter(false);
                  }}
                  className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                    activeIndustry === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
    
        {/* 主要取引所フィルター */}
        <div className="relative" ref={exchangeFilterRef}>
          <button 
            onClick={() => {
              setShowExchangeFilter(!showExchangeFilter);
              if (showIndustryFilter) setShowIndustryFilter(false);
              if (showSortOptions) setShowSortOptions(false);
            }}
            className="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span>取引所: {activeExchange}</span>
            <ChevronDown size={16} className="ml-2 text-gray-500" />
          </button>
      
          {showExchangeFilter && (
            <div 
              className="absolute z-[60] mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {exchanges.map((exchange) => (
                <button
                  key={exchange}
                  onClick={() => {
                    setActiveExchange(exchange);
                    setShowExchangeFilter(false);
                  }}
                  className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                    activeExchange === exchange ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  {exchange}
                </button>
              ))}
            </div>
          )}
        </div>
          
        {/* 並び替え */}
        <div className="relative" ref={sortFilterRef}>
          <button 
            onClick={() => {
              setShowSortOptions(!showSortOptions);
              if (showIndustryFilter) setShowIndustryFilter(false);
              if (showExchangeFilter) setShowExchangeFilter(false);
            }}
            className="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span>並び替え: {activeSortOption}</span>
            <ChevronDown size={16} className="ml-2 text-gray-500" />
          </button>
            
          {showSortOptions && (
            <div 
              className="absolute z-[60] mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setActiveSortOption(option);
                    setShowSortOptions(false);
                  }}
                  className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                    activeSortOption === option ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* フィルターリセットボタン */}
        {(activeIndustry !== 'すべて' || activeExchange !== 'すべて' || activeSortOption !== '新着順' || keyword) && (
          <button
            onClick={handleResetFilters}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg border border-gray-300"
          >
            <Filter size={16} className="inline mr-1" />
            リセット
          </button>
        )}
      </div>
      
      {/* アクティブフィルターの表示 */}
      {(activeIndustry !== 'すべて' || activeExchange !== 'すべて' || keyword) && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600 mr-2">アクティブフィルター:</span>
          {keyword && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              キーワード: {keyword}
              <button onClick={() => setKeyword('')} className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none">
                ×
              </button>
            </span>
          )}
          {activeIndustry !== 'すべて' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              業界: {getIndustryLabel(activeIndustry)}
              <button onClick={() => setActiveIndustry('すべて')} className="ml-1 text-green-600 hover:text-green-800 focus:outline-none">
                ×
              </button>
            </span>
          )}
          {activeExchange !== 'すべて' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              取引所: {activeExchange}
              <button onClick={() => setActiveExchange('すべて')} className="ml-1 text-purple-600 hover:text-purple-800 focus:outline-none">
                ×
              </button>
            </span>
          )}
        </div>
      )}
      
      {/* 結果件数表示 */}
      {!loading && !userLoading && !error && (
        <div className="mb-4 text-sm text-gray-600">
          {filteredCompanies.length}件の企業が見つかりました
          {activeSortOption !== '新着順' && (
            <span className="ml-2 text-gray-500">（{activeSortOption}）</span>
          )}
        </div>
      )}
      
      {/* ローディング表示 */}
      {(loading || userLoading) && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">データを読み込み中...</span>
        </div>
      )}
      
      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700 mb-4">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
          >
            再読み込み
          </button>
        </div>
      )}
      
      {/* データ表示 */}
      {!loading && !userLoading && !error && (
        <div className="grid grid-cols-2 gap-6">
          {filteredCompanies.map(company => (
            <CompanyGridCard 
              key={company.companyId} 
              company={company} 
              isGuest={isGuest}
              onFollowToggle={handleFollowToggle}
              onShowGuestPopup={() => setShowGuestPopup(true)}
            />
          ))}
        </div>
      )}
      
      {/* データが空の場合 */}
      {!loading && !userLoading && !error && filteredCompanies.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">該当する企業が見つかりませんでした。</p>
          <p className="text-gray-500 mt-1">検索条件を変更してお試しください。</p>
          {(activeIndustry !== 'すべて' || activeExchange !== 'すべて' || keyword) && (
            <button
              onClick={handleResetFilters}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              フィルターをリセット
            </button>
          )}
        </div>
      )}
      
      {/* ゲスト制限ポップアップ */}
      {showGuestPopup && (
        <GuestRestrictedContent 
          featureName="フォロー機能" 
          isPopup={true}
          onClose={() => setShowGuestPopup(false)}
        />
      )}
    </div>
  );
};

interface CompanyCardProps {
  company: CompanyItem;
  isGuest: boolean;
  onFollowToggle: (companyId: string, currentFollowStatus: boolean) => void;
  onShowGuestPopup: () => void;
}

const CompanyGridCard = ({ company, isGuest, onFollowToggle, onShowGuestPopup }: CompanyCardProps) => {
  const pathname = usePathname();
  
  const handleCardClick = async () => {
    // 企業詳細ページに遷移（アクセストラッキングはバックエンドで自動実行）
    window.location.assign(`/investor/company/${company.companyId}`);
  };
  
  return (
    <div 
      onClick={handleCardClick} 
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all h-full cursor-pointer"
    >
      <div className="p-5 flex h-full">
        {/* ロゴ部分 - 縦幅いっぱい */}
        <div className="flex-shrink-0 mr-4">
          {company.logoUrl ? (
            <img src={getFullImageUrl(company.logoUrl)} alt={`${company.companyName} logo`} className="w-32 h-full rounded-md object-cover bg-gray-100" />
          ) : (
            <div className="w-32 h-full rounded-md bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-500">
              {company.companyName.charAt(0)}
            </div>
          )}
        </div>
        
        {/* 右側のコンテンツ */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* 上部：企業名、証券コード、タグ */}
          <div className="mb-2">
            <h3 className="font-medium text-gray-800 truncate">{company.companyName}</h3>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {company.securitiesCode && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                  証券コード: {company.securitiesCode}
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {getIndustryLabel(company.industry)}
              </span>
              {company.majorStockExchange && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                  {company.majorStockExchange}
                </span>
              )}
            </div>
          </div>
          
          {/* 下部：事業説明とフォローボタン */}
          <div className="flex items-end justify-between gap-2">
            <div className="flex-1 min-w-0">
              {company.businessDescription ? (
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {company.businessDescription}
                </p>
              ) : (
                <p className="text-xs text-gray-400 italic">-</p>
              )}
            </div>
            
            {isGuest ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowGuestPopup();
                }}
                className="px-2 py-1 rounded-md text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 flex-shrink-0 flex items-center gap-1"
              >
                フォロー
                <Lock size={12} />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFollowToggle(company.companyId, company.isFollowed);
                }}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors flex-shrink-0 ${
                  company.isFollowed ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {company.isFollowed ? 'フォロー中' : 'フォロー'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CompanyListCard = ({ company, isGuest, onFollowToggle, onShowGuestPopup }: CompanyCardProps) => {
  const pathname = usePathname();
  
  const handleCardClick = async () => {
    // 企業詳細ページに遷移（アクセストラッキングはバックエンドで自動実行）
    window.location.assign(`/investor/company/${company.companyId}`);
  };

  return (
    <div 
      onClick={handleCardClick} 
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all h-full cursor-pointer"
    >
      <div className="p-4 flex items-start h-full">
        {company.logoUrl ? (
          <img src={getFullImageUrl(company.logoUrl)} alt={`${company.companyName} logo`} className="w-16 h-10 rounded-md object-contain bg-gray-100 mr-4" />
        ) : (
          <div className="w-16 h-10 rounded-md bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-500 mr-4">
            {company.companyName.charAt(0)}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap justify-between items-start">
            <div className="flex-1 min-w-0 mr-4">
              <h3 className="font-medium text-gray-800">{company.companyName}</h3>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {company.securitiesCode && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                    証券コード: {company.securitiesCode}
                  </span>
                )}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  {getIndustryLabel(company.industry)}
                </span>
                {company.majorStockExchange && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                    {company.majorStockExchange}
                  </span>
                )}
              </div>
              {/* 事業説明 */}
              <div className="mt-2">
                {company.businessDescription ? (
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {company.businessDescription}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">-</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {isGuest ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowGuestPopup();
            }}
            className="ml-4 px-2 py-1 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 flex-shrink-0"
          >
            ログインが必要
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFollowToggle(company.companyId, company.isFollowed);
            }}
            className={`ml-4 px-2 py-1 rounded-md text-sm font-medium transition-colors flex-shrink-0 ${
              company.isFollowed ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {company.isFollowed ? 'フォロー中' : 'フォローする'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CompanyListing;
