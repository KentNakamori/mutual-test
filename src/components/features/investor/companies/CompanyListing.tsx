// src/components/features/investor/companies/CompanyListing.tsx
import React, { useState, useEffect } from 'react';
import { Heart, Filter, Search, Grid, List, ChevronDown, ExternalLink } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Industry, INDUSTRY_OPTIONS, getIndustryLabel } from '@/types/industry';
import GuestRestrictedContent from '@/components/features/investor/common/GuestRestrictedContent';
import { useUser } from '@auth0/nextjs-auth0';
import { getFullImageUrl } from '@/lib/utils/imageUtils';//画像のURLを取得する関数仮

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
  // ゲスト判定: ユーザーがいない、ローディングが終了、エラーがない
  const isGuest = !user && !userLoading && !userError;
  const token = undefined;
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showGenreFilter, setShowGenreFilter] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [activeGenre, setActiveGenre] = useState<Industry | 'すべて'>('すべて');
  const [activeSortOption, setActiveSortOption] = useState('新着順');
  const [showExchangeFilter, setShowExchangeFilter] = useState(false);
  const [activeExchange, setActiveExchange] = useState('すべて');
  const [keyword, setKeyword] = useState('');
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // APIからデータ取得
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/proxy/investor/companies');
        
        // 401エラー（認証エラー）の場合は空の配列を返す（ゲストとして扱う）
        if (response.status === 401) {
          console.warn('認証エラー: ゲストユーザーとして処理します');
          setCompanies([]);
          // コールバック呼び出し（空の配列）
          if (onCompaniesLoaded) {
            onCompaniesLoaded([]);
          }
          return;
        }
        
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        
        const data = await response.json();
        console.log('取得した企業データ:', data);
        
        // dataが配列の場合とオブジェクトの場合の両方に対応
        const companiesList = Array.isArray(data) ? data : data.companies || [];
        
        // フォロー済みフィルターを適用
        const filteredData = isFollowedOnly 
          ? companiesList.filter((company: CompanyItem) => company.isFollowed === true)
          : companiesList;
        
        setCompanies(filteredData);
        
        // トラッキング用にコールバック呼び出し
        if (onCompaniesLoaded) {
          onCompaniesLoaded(filteredData.map((company: CompanyItem) => ({ companyId: company.companyId })));
        }
      } catch (err) {
        console.error('企業データ取得エラー:', err);
        
        // ネットワークエラーなどの場合
        if (err instanceof TypeError && err.message.includes('fetch')) {
          setError('ネットワークエラー: サーバーに接続できません');
        } else {
          setError(err instanceof Error ? err.message : '企業データの取得に失敗しました');
        }
        
        // エラー時もコールバック呼び出し（空の配列）
        if (onCompaniesLoaded) {
          onCompaniesLoaded([]);
        }
      } finally {
        setLoading(false);
      }
    };

    // ゲストユーザーでもデータを取得
    fetchCompanies();
  }, [isFollowedOnly, onCompaniesLoaded]);
  
  // フィルターとソートのオプション
  const genres = ['すべて', ...INDUSTRY_OPTIONS.map(option => option.value)];
  const exchanges = ['すべて', '東証プライム', '東証スタンダード', '東証グロース'];
  const sortOptions = ['新着順', '名前順 (A-Z)', '名前順 (Z-A)'];
  
  // フィルター適用とソート処理
  const getFilteredAndSortedCompanies = () => {
    let filtered = [...companies];
    
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
      window.location.assign('/investor/login');
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
    setActiveGenre('すべて');
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
        <div className="relative">
          <button 
            onClick={() => {
              setShowGenreFilter(!showGenreFilter);
              if (showExchangeFilter) setShowExchangeFilter(false);
              if (showSortOptions) setShowSortOptions(false);
            }}
            className="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span>業界: {activeGenre === 'すべて' ? 'すべて' : getIndustryLabel(activeGenre)}</span>
            <ChevronDown size={16} className="ml-2 text-gray-500" />
          </button>
      
          {showGenreFilter && (
            <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 max-h-60 overflow-y-auto">
              <button
                onClick={() => {
                  setActiveGenre('すべて');
                  setShowGenreFilter(false);
                }}
                className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                  activeGenre === 'すべて' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                }`}
              >
                すべて
              </button>
              {INDUSTRY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setActiveGenre(option.value);
                    setShowGenreFilter(false);
                  }}
                  className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                    activeGenre === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
    
        {/* 主要取引所フィルター */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowExchangeFilter(!showExchangeFilter);
              if (showGenreFilter) setShowGenreFilter(false);
              if (showSortOptions) setShowSortOptions(false);
            }}
            className="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span>取引所: {activeExchange}</span>
            <ChevronDown size={16} className="ml-2 text-gray-500" />
          </button>
      
          {showExchangeFilter && (
            <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
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
        <div className="relative">
          <button 
            onClick={() => {
              setShowSortOptions(!showSortOptions);
              if (showGenreFilter) setShowGenreFilter(false);
              if (showExchangeFilter) setShowExchangeFilter(false);
            }}
            className="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span>並び替え: {activeSortOption}</span>
            <ChevronDown size={16} className="ml-2 text-gray-500" />
          </button>
            
          {showSortOptions && (
            <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
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
        {(activeGenre !== 'すべて' || activeExchange !== 'すべて' || activeSortOption !== '新着順' || keyword) && (
          <button
            onClick={handleResetFilters}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg border border-gray-300"
          >
            <Filter size={16} className="inline mr-1" />
            リセット
          </button>
        )}
          
        {/* 表示切替 */}
        <div className="ml-auto flex items-center bg-white rounded-lg border shadow-sm p-1">
          <button 
            onClick={() => setViewMode('grid')} 
            className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <Grid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')} 
            className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>
      
      {/* アクティブフィルターの表示 */}
      {(activeGenre !== 'すべて' || activeExchange !== 'すべて' || keyword) && (
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
          {activeGenre !== 'すべて' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              業界: {getIndustryLabel(activeGenre)}
              <button onClick={() => setActiveGenre('すべて')} className="ml-1 text-green-600 hover:text-green-800 focus:outline-none">
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
        viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-6">
            {filteredCompanies.map(company => (
              <CompanyGridCard 
                key={company.companyId} 
                company={company} 
                isGuest={isGuest}
                onFollowToggle={handleFollowToggle} 
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCompanies.map(company => (
              <CompanyListCard 
                key={company.companyId} 
                company={company} 
                isGuest={isGuest}
                onFollowToggle={handleFollowToggle} 
              />
            ))}
          </div>
        )
      )}
      
      {/* データが空の場合 */}
      {!loading && !userLoading && !error && filteredCompanies.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">該当する企業が見つかりませんでした。</p>
          <p className="text-gray-500 mt-1">検索条件を変更してお試しください。</p>
          {(activeGenre !== 'すべて' || activeExchange !== 'すべて' || keyword) && (
            <button
              onClick={handleResetFilters}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              フィルターをリセット
            </button>
          )}
        </div>
      )}
    </div>
  );
};

interface CompanyCardProps {
  company: CompanyItem;
  isGuest: boolean;
  onFollowToggle: (companyId: string, currentFollowStatus: boolean) => void;
}

const CompanyGridCard = ({ company, isGuest, onFollowToggle }: CompanyCardProps) => {
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
            <img src={getFullImageUrl(company.logoUrl)} alt={`${company.companyName} logo`} className="w-28 h-full rounded-md object-cover bg-gray-100" />
          ) : (
            <div className="w-28 h-full rounded-md bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-500">
              {company.companyName.charAt(0)}
            </div>
          )}
        </div>
        
        {/* 右側のコンテンツ */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* 上部：企業名と証券コード */}
          <div className="mb-3">
            <h3 className="font-medium text-gray-800 truncate">{company.companyName}</h3>
            {company.securitiesCode && (
              <p className="text-xs text-gray-400 mt-1">証券コード: {company.securitiesCode}</p>
            )}
          </div>
          
          {/* 下部：タグとフォローボタン */}
          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-wrap gap-1 flex-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {getIndustryLabel(company.industry)}
              </span>
              {company.majorStockExchange && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                  {company.majorStockExchange}
                </span>
              )}
            </div>
            
            {isGuest ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.assign('/investor/login');
                }}
                className="px-2 py-1 rounded-md text-xs font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 flex-shrink-0"
              >
                ログイン必要
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

const CompanyListCard = ({ company, isGuest, onFollowToggle }: CompanyCardProps) => {
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
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {company.securitiesCode && (
                  <span className="text-xs text-gray-500">証券コード: {company.securitiesCode}</span>
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
          </div>
        </div>
        
        {isGuest ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.assign('/investor/login');
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
