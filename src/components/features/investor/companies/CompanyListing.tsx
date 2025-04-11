// src/components/features/investor/companies/CompanyListing.tsx
import React, { useState } from 'react';
import { Search, ChevronDown, Grid, List, ExternalLink, Filter } from 'lucide-react';

const CompanyListing = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showGenreFilter, setShowGenreFilter] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [activeGenre, setActiveGenre] = useState('すべて');
  const [activeSortOption, setActiveSortOption] = useState('新着順');
  
  // サンプルデータ（実際は API 等から取得）
  const companies = [
    { 
      id: 1, 
      name: 'テック・イノベーターズ株式会社', 
      stockCode: '1234',
      exchange: '東証プライム',
      website: 'https://www.tech-innovators.co.jp',
      industry: 'Technology',
      category: 'テクノロジー', 
      logo: '/tech-logo.png',
      description: 'AIと機械学習技術を活用した次世代ソリューションの開発企業',
      followed: false
    },
    { 
      id: 2, 
      name: 'グリーンエナジー株式会社', 
      stockCode: '5678',
      exchange: '東証プライム',
      website: 'https://www.green-energy.co.jp',
      industry: 'Energy',
      category: 'エネルギー', 
      logo: '/energy-logo.png',
      description: '再生可能エネルギーの開発と持続可能なエネルギーソリューションの提供',
      followed: false
    },
    { 
      id: 3, 
      name: 'ヘルスプラス合同会社', 
      stockCode: '9012',
      exchange: '東証スタンダード',
      website: 'https://www.health-plus.co.jp',
      industry: 'Healthcare',
      category: 'ヘルスケア',
      logo: '/health-logo.png',
      description: 'デジタルヘルスケアサービスとウェルネスソリューションの提供企業',
      followed: false
    },
  ];
  
  const genres = ['すべて', 'テクノロジー', 'エネルギー', 'ヘルスケア', '金融', '小売', '製造', '不動産', 'サービス'];
  
  const sortOptions = ['新着順', '名前順 (A-Z)', '名前順 (Z-A)', 'いいね数: 高い順', 'いいね数: 低い順'];
  
  // フィルター適用
  const filteredCompanies = companies.filter(company => 
    activeGenre === 'すべて' || company.category === activeGenre
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 表題、検索バー等の重複している上側の要素は親側で削除済み */}
      
      {/* 検索・フィルター・並び替えエリア */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* 検索バー */}
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="企業名・キーワードで検索" 
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* ジャンルフィルター */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowGenreFilter(!showGenreFilter);
              if (showSortOptions) setShowSortOptions(false);
            }}
            className="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center">
              <Filter size={16} className="mr-2 text-gray-500" />
              <span>ジャンル: {activeGenre}</span>
            </div>
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
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-6">
          {filteredCompanies.map(company => (
            <CompanyGridCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCompanies.map(company => (
            <CompanyListCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
};

const CompanyGridCard = ({ company }: { company: any }) => {
  const [followed, setFollowed] = useState(company.followed);
  
  const handleCardClick = () => {
    window.location.assign(`/investor/company/${company.id}`);
  };
  
  return (
    <div 
      onClick={handleCardClick} 
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all h-full cursor-pointer"
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-center mb-4">
          {company.logo ? (
            <img src={company.logo} alt={`${company.name} logo`} className="w-12 h-12 rounded-md object-contain bg-gray-100 mr-4" />
          ) : (
            <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-500 mr-4">
              {company.name.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-800">{company.name}</h3>
            <p className="text-sm text-gray-500">{company.category}</p>
          </div>
        </div>
        
        <div className="mb-4 space-y-1 text-sm text-gray-600 flex-grow">
          <div className="flex">
            <span className="w-32 text-gray-500">証券コード:</span>
            <span className="font-medium">{company.stockCode}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-500">主要取引所:</span>
            <span className="font-medium">{company.exchange}</span>
          </div>
          <div className="flex overflow-hidden">
            <span className="w-32 text-gray-500">HP:</span>
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline truncate flex items-center"
            >
              {company.website.replace('https://', '')}
              <ExternalLink size={12} className="ml-1 flex-shrink-0" />
            </a>
          </div>
        </div>
        
        <div className="mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            {company.industry}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{company.description}</p>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setFollowed(!followed);
          }}
          className={`w-full py-1 px-2 rounded-md text-sm font-medium transition-colors ${
            followed ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {followed ? 'フォロー中' : 'フォローする'}
        </button>
      </div>
    </div>
  );
};

const CompanyListCard = ({ company }: { company: any }) => {
  const [followed, setFollowed] = useState(company.followed);
  
  const handleCardClick = () => {
    window.location.assign(`/investor/company/${company.id}`);
  };

  return (
    <div 
      onClick={handleCardClick} 
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all h-full cursor-pointer"
    >
      <div className="p-4 flex items-start h-full">
        {company.logo ? (
          <img src={company.logo} alt={`${company.name} logo`} className="w-12 h-12 rounded-md object-contain bg-gray-100 mr-4" />
        ) : (
          <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-500 mr-4">
            {company.name.charAt(0)}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-800">{company.name}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span className="text-gray-500 mr-2">証券コード: {company.stockCode}</span>
                <span className="text-gray-500 mr-2">|</span>
                <span className="text-gray-500">{company.exchange}</span>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 mt-1">
              {company.industry}
            </span>
          </div>
          
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <span>HP:</span>
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ml-1 text-blue-600 hover:underline truncate flex items-center"
            >
              {company.website.replace('https://', '')}
              <ExternalLink size={10} className="ml-1 flex-shrink-0" />
            </a>
          </div>
          
          <p className="mt-2 text-sm text-gray-600 line-clamp-1">{company.description}</p>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setFollowed(!followed);
          }}
          className={`ml-4 px-2 py-1 rounded-md text-sm font-medium transition-colors flex-shrink-0 ${
            followed ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {followed ? 'フォロー中' : 'フォローする'}
        </button>
      </div>
    </div>
  );
};

export default CompanyListing;
