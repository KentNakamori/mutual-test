// src/components/features/investor/companies/CompanyListing.tsx
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Grid, List, ExternalLink, Filter } from 'lucide-react';
import { useGuest } from '@/contexts/GuestContext';
import GuestRestrictedContent from '@/components/features/investor/common/GuestRestrictedContent';
import { getInvestorCompanies, followInvestorCompany } from '@/libs/api';
import { useAuth } from '@/hooks/useAuth';

// APIレスポンスの型定義
interface CompanyItem {
  companyId: string;
  companyName: string;
  industry: string;
  logoUrl?: string;
  isFollowed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CompanyListResponse {
  companies: CompanyItem[];
  totalCount: number;
  totalPages: number;
}

const CompanyListing = () => {
  const { isGuest } = useGuest();
  const { token } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showGenreFilter, setShowGenreFilter] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [activeGenre, setActiveGenre] = useState('すべて');
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
      setLoading(true);
      setError(null);
      try {
        const query: { keyword?: string; industry?: string } = {};
        
        if (keyword) {
          query.keyword = keyword;
        }
        
        if (activeGenre !== 'すべて') {
          query.industry = activeGenre;
        }

        // デバッグログ：クエリパラメータの確認
        console.log('Fetching companies with query:', query);
        console.log('Current token:', token);
        
        const response = await getInvestorCompanies(token || undefined, query);
        console.log('API Response:', response);
        
        setCompanies(response.companies);
      } catch (err) {
        console.error('企業データの取得に失敗しました', err);
        setError('企業データの取得に失敗しました。再度お試しください。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanies();
  }, [keyword, activeGenre, token]);
  
  const genres = ['すべて', 'テクノロジー', 'エネルギー', 'ヘルスケア', '金融', '小売', '製造', '不動産', 'サービス'];
  const exchanges = ['すべて', '東証プライム', '東証スタンダード'];
  const sortOptions = ['新着順', '名前順 (A-Z)', '名前順 (Z-A)'];
  
  // フィルター適用（APIからのデータに対して）
  const filteredCompanies = companies.filter(company => 
    (activeExchange === 'すべて' || company.industry === activeExchange)
  );
  
  // フォロー/アンフォロー処理
  const handleFollowToggle = async (companyId: string, currentFollowStatus: boolean) => {
    if (isGuest || !token) {
      return;
    }
    
    try {
      const action = currentFollowStatus ? 'unfollow' : 'follow';
      await followInvestorCompany(companyId, action, token);
      
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
        
        {/* ジャンルフィルター */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowGenreFilter(!showGenreFilter);
              if (showExchangeFilter) setShowExchangeFilter(false);
            }}
            className="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span>ジャンル: {activeGenre}</span>
            <ChevronDown size={16} className="ml-2 text-gray-500" />
          </button>
      
          {showGenreFilter && (
            <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    setActiveGenre(genre);
                    setShowGenreFilter(false);
                  }}
                  className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                    activeGenre === genre ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  {genre}
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
            }}
            className="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span>主要取引所: {activeExchange}</span>
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
      
      {/* フィルターの表示 */}
      {activeGenre !== 'すべて' && (
        <div className="mb-4 flex items-center">
          <span className="text-sm text-gray-600 mr-2">フィルター:</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {activeGenre}
            <button onClick={() => setActiveGenre('すべて')} className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none">
              ×
            </button>
          </span>
        </div>
      )}
      
      {/* ローディング表示 */}
      {loading && (
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
      {!loading && !error && (
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
      {!loading && !error && filteredCompanies.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">該当する企業が見つかりませんでした。</p>
          <p className="text-gray-500 mt-1">検索条件を変更してお試しください。</p>
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
          <div>
            <h3 className="font-medium text-gray-800">{company.companyName}</h3>
            <p className="text-sm text-gray-500">{company.industry}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            {company.industry}
          </span>
        </div>
        
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
            <div>
              <h3 className="font-medium text-gray-800">{company.companyName}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span className="text-gray-500">{company.industry}</span>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 mt-1">
              {company.industry}
            </span>
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
