// src/components/features/investor/companies/CompanyListing.tsx
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Grid, List, ExternalLink, Filter } from 'lucide-react';
import { useGuest } from '@/contexts/GuestContext';
import GuestRestrictedContent from '@/components/features/investor/common/GuestRestrictedContent';
import { getInvestorCompanies, followInvestorCompany } from '@/lib/api';
import { useUser } from "@auth0/nextjs-auth0";
import { Industry, INDUSTRY_OPTIONS, getIndustryLabel } from '@/types/industry';

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
}

const CompanyListing: React.FC<CompanyListingProps> = ({ isFollowedOnly = false }) => {
  const { isGuest } = useGuest();
  const { user, error: userError, isLoading: userLoading } = useUser();
  // Auth0 SDK v4では、JWTトークンをプロキシ経由で送信するため、tokenはundefinedに設定
  // プロキシで自動的にトークンが付与される
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // APIからデータ取得
  useEffect(() => {
    const fetchCompanies = async () => {
      if (userLoading) return; // ユーザー情報のロード中は処理しない
      
      setLoading(true);
      setError(null);
      try {
        const query: { keyword?: string; industry?: Industry; followed?: string } = {};
        
        if (keyword) {
          query.keyword = keyword;
        }
        
        if (activeGenre !== 'すべて') {
          query.industry = activeGenre;
        }

        // フォロー済みのみ表示フラグが有効な場合はクエリに追加
        if (isFollowedOnly) {
          query.followed = 'true';
        }

        // デバッグログ：クエリパラメータの確認
        console.log('Fetching companies with query:', query);
        
        // Auth0 SDK v4用の対応：token=undefinedにしてプロキシ経由で認証情報を送信
        const response = await getInvestorCompanies(undefined, query);
        console.log('API Response:', response);
        
        setCompanies(response.companies);
      } catch (err) {
        console.error('企業データの取得に失敗しました', err);
        setError('企業データの取得に失敗しました。再度お試しください。');
      } finally {
        setLoading(false);
      }
    };
    
    // ユーザー認証状態に基づいて処理
    if (!userLoading) {
      fetchCompanies();
    }
  }, [keyword, activeGenre, userLoading, isFollowedOnly]);
  
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
  
  // フォロー/アンフォロー処理
  const handleFollowToggle = async (companyId: string, currentFollowStatus: boolean) => {
    if (isGuest || userLoading || userError || !user) {
      return;
    }
    
    try {
      const action = currentFollowStatus ? 'unfollow' : 'follow';
      // Auth0 SDK v4用の対応：tokenを適切な値に設定（プロキシ経由での認証）
      await followInvestorCompany(companyId, action, "");
      
      // 成功したら、ローカルの状態を更新
      setCompanies(prev => 
        prev.map(company => 
          company.companyId === companyId 
            ? { ...company, isFollowed: !currentFollowStatus } 
            : company
        )
      );
    } catch (err) {
      console.error('フォロー操作に失敗しました', err);
      alert('フォロー操作に失敗しました。再度お試しください。');
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
  
  // 認証エラーの場合
  if (userError && !isGuest) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">認証エラーが発生しました。再度ログインしてください。</p>
      </div>
    );
  }
  
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
  const handleCardClick = () => {
    window.location.assign(`/investor/company/${company.companyId}`);
  };
  
  return (
    <div 
      onClick={handleCardClick} 
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all h-full cursor-pointer"
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-center mb-4">
          {company.logoUrl ? (
            <img src={company.logoUrl} alt={`${company.companyName} logo`} className="w-12 h-12 rounded-md object-contain bg-gray-100 mr-4" />
          ) : (
            <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-500 mr-4">
              {company.companyName.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-medium text-gray-800">{company.companyName}</h3>
            <p className="text-sm text-gray-500">{getIndustryLabel(company.industry)}</p>
            {company.securitiesCode && (
              <p className="text-xs text-gray-400">証券コード: {company.securitiesCode}</p>
            )}
          </div>
        </div>
        
        <div className="mb-3 flex flex-wrap gap-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            {getIndustryLabel(company.industry)}
          </span>
          {company.majorStockExchange && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-100">
              {company.majorStockExchange}
            </span>
          )}
        </div>
        
        {company.businessDescription && (
          <div className="mt-1">
            <p 
              className="text-xs text-gray-600 overflow-hidden" 
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical'
              } as React.CSSProperties}
            >
              {company.businessDescription}
            </p>
          </div>
        )}
        
        {company.websiteUrl && (
          <div className="mb-3">
            <a 
              href={company.websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
            >
              <ExternalLink size={12} className="mr-1" />
              公式サイト
            </a>
          </div>
        )}
        
        {isGuest ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.assign('/investor/login');
            }}
            className="w-full py-1 px-2 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            フォローするにはログインが必要です
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFollowToggle(company.companyId, company.isFollowed);
            }}
            className={`w-full py-1 px-2 rounded-md text-sm font-medium transition-colors ${
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

const CompanyListCard = ({ company, isGuest, onFollowToggle }: CompanyCardProps) => {
  const handleCardClick = () => {
    window.location.assign(`/investor/company/${company.companyId}`);
  };

  return (
    <div 
      onClick={handleCardClick} 
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all h-full cursor-pointer"
    >
      <div className="p-4 flex items-start h-full">
        {company.logoUrl ? (
          <img src={company.logoUrl} alt={`${company.companyName} logo`} className="w-12 h-12 rounded-md object-contain bg-gray-100 mr-4" />
        ) : (
          <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-500 mr-4">
            {company.companyName.charAt(0)}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap justify-between items-start">
            <div className="flex-1 min-w-0 mr-4">
              <h3 className="font-medium text-gray-800">{company.companyName}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span className="text-gray-500">{getIndustryLabel(company.industry)}</span>
                {company.securitiesCode && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="text-xs">証券コード: {company.securitiesCode}</span>
                  </>
                )}
              </div>
              {company.businessDescription && (
                <div className="mt-1">
                  <p 
                    className="text-xs text-gray-600 overflow-hidden" 
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical'
                    } as React.CSSProperties}
                  >
                    {company.businessDescription}
                  </p>
                </div>
              )}
              {company.websiteUrl && (
                <a 
                  href={company.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center mt-1"
                >
                  <ExternalLink size={12} className="mr-1" />
                  公式サイト
                </a>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
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
