import React, { useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import Input from '@/components/ui/Input';
import FiscalPeriodSelect from '@/components/ui/FiscalPeriodSelect';
import AiGenerateButton from './AiGenerateButton';
import Button from '@/components/ui/Button';
import ReactMarkdown from 'react-markdown';
import { QA, TagOption } from '@/types';
import { createCorporateQa, generateCorporateQaAnswer } from '@/lib/api';
import {
  INFO_SOURCE_OPTIONS,
  CATEGORY_OPTION,
  QUESTION_ROUTE_OPTIONS,
  getTagColor,
} from '@/components/ui/tagConfig';
import { X, Plus, BookOpen, HelpCircle, CheckCircle, Calendar, FileText, Tag, Activity, Eye, Edit } from 'lucide-react';

export interface QaCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newQa: QA) => void;
}

const QaCreateModal: React.FC<QaCreateModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [fiscalPeriod, setFiscalPeriod] = useState('');
  const [questionRoute, setQuestionRoute] = useState('');
  const [source, setSource] = useState<string[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [reviewStatus, setReviewStatus] = useState<QA['reviewStatus']>('DRAFT');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSourceList, setShowSourceList] = useState(false);
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [showInvestorPreview, setShowInvestorPreview] = useState(false);

  const handleGenerateAI = async () => {
    if (!question || !fiscalPeriod) {
      return;
    }

    setIsGeneratingAI(true);
    setError(null);

    try {
      const response = await generateCorporateQaAnswer({
        question,
        fiscalPeriod,
      });

      setAnswer(response.answer);
      setSource(response.sources || []);
    } catch (error) {
      console.error("AI回答生成に失敗しました:", error);
      setError("AI回答の生成に失敗しました。もう一度お試しください。");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const getAIButtonStatus = () => {
    if (!question || question.trim() === '') {
      return { disabled: true, tooltip: '質問内容を入力してください' };
    }
    if (!fiscalPeriod || fiscalPeriod.trim() === '') {
      return { disabled: true, tooltip: '決算期を選択してください' };
    }
    if (answer && answer.trim() !== '') {
      return { disabled: true, tooltip: '回答内容が既に入力されています' };
    }
    return { disabled: false, tooltip: '' };
  };

  const handleSave = async () => {
    if (!title || !question || !answer) {
      setError('必須項目を入力してください');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const result = await createCorporateQa({
        title,
        question,
        answer,
        fiscalPeriod,
        question_route: questionRoute,
        source,
        category,
        reviewStatus,
      });

      // 作成されたQAのデータを作成
      const newQa: QA = {
        qaId: result.qaId,
        title,
        question,
        answer,
        fiscalPeriod,
        question_route: questionRoute,
        source,
        category,
        reviewStatus,
        status: 'draft',
        likeCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        companyId: '',
        companyName: '',
      };

      onCreated(newQa);
      onClose();
    } catch (error) {
      console.error("QAの作成に失敗しました:", error);
      setError("QAの作成に失敗しました。もう一度お試しください。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSource = (option: TagOption) => {
    if (!source.includes(option.label)) {
      setSource([...source, option.label]);
    }
  };

  const handleRemoveSource = (label: string) => {
    setSource(source.filter((s) => s !== label));
  };

  const handleAddCategory = (option: TagOption) => {
    if (!category.includes(option.label)) {
      setCategory([...category, option.label]);
    }
  };

  const handleRemoveCategory = (label: string) => {
    setCategory(category.filter((g) => g !== label));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title=""
      className="max-w-7xl my-10"
      showCloseButton={false}
    >
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {/* AI生成中のオーバーレイ */}
        {isGeneratingAI && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-lg font-medium text-gray-700">AI回答を生成中...</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="relative">
          {/* カスタムヘッダー */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 -mt-4 mb-6">
            <h1 className="text-xl font-semibold text-gray-900">新規Q&A作成</h1>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setShowInvestorPreview(false)}
                className={`px-4 py-2 text-sm font-medium transition-colors flex items-center ${
                  !showInvestorPreview 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Edit size={16} className="mr-2" />
                編集
              </button>
              <button
                type="button"
                onClick={() => setShowInvestorPreview(true)}
                className={`px-4 py-2 text-sm font-medium transition-colors flex items-center ${
                  showInvestorPreview 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Eye size={16} className="mr-2" />
                プレビュー
              </button>
            </div>
          </div>

          {showInvestorPreview ? (
            // Investor画面と同じプレビュー表示
            <div className="p-6 bg-white rounded-lg relative">
              {/* ヘッダー情報 */}
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">{title || 'タイトル未入力'}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    <span>{formatDate(new Date().toISOString())}</span>
                  </div>
                  <div className="flex items-center">
                    <FileText size={16} className="mr-2 text-gray-500" />
                    <span>{fiscalPeriod || '未選択'}</span>
                  </div>
                  {questionRoute && (
                    <div className="flex items-center">
                      <Tag size={16} className="mr-2 text-gray-500" />
                      <span>{questionRoute}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 質問エリア */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                  <HelpCircle size={16} className="mr-2" />
                  質問
                </h3>
                <p className="text-gray-800 leading-relaxed">{question || '質問内容を入力してください'}</p>
              </div>
              
              {/* 回答エリア */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h3 className="text-sm font-medium text-green-800 mb-2 flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  回答
                </h3>
                <div className="bg-white border border-green-200 rounded-lg p-4">
                  <div className="text-gray-800 leading-relaxed prose prose-sm max-w-none">
                    <ReactMarkdown>
                      {answer || '*回答内容を入力してください*'}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
              
              {/* メタデータエリア */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* 情報ソース */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <BookOpen size={14} className="mr-2 text-gray-600" />
                    情報ソース
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {source && source.length > 0 ? (
                      source.map((src) => (
                        <span
                          key={src}
                          className="inline-flex items-center bg-white border border-gray-300 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          <BookOpen size={10} className="mr-1" />
                          {src}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">情報ソースなし</span>
                    )}
                  </div>
                </div>
                
                {/* カテゴリ */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Activity size={14} className="mr-2 text-gray-600" />
                    カテゴリ
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {category && category.length > 0 ? (
                      category.map((g) => (
                        <span
                          key={g}
                          className={`inline-flex items-center ${getTagColor(g)} px-2 py-1 rounded text-xs font-medium`}
                        >
                          {g}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">カテゴリ未設定</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* いいねボタン */}
              <div className="flex justify-end mt-4">
                <div className="flex items-center bg-gray-100 text-gray-600 px-4 py-2 rounded-lg">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </div>
          ) : (
            // 編集モード（レスポンシブ対応）
            <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 p-4 sm:p-6 overflow-x-hidden">
              {/* 左側：メタデータ */}
              <div className="lg:col-span-2 space-y-5 min-w-0">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    質問タイトル <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={title}
                    onChange={setTitle}
                    placeholder="タイトルを入力"
                    className="w-full min-w-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">決算期</label>
                  <div className="w-full min-w-0">
                    <FiscalPeriodSelect
                      value={fiscalPeriod}
                      onChange={setFiscalPeriod}
                      includeEmpty={true}
                      className="w-full min-w-0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">質問ルート</label>
                  <select
                    value={questionRoute}
                    onChange={(e) => setQuestionRoute(e.target.value)}
                    className="w-full min-w-0 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">質問ルートを選択</option>
                    {QUESTION_ROUTE_OPTIONS.map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
                  <select
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value as QA['reviewStatus'])}
                    className="w-full min-w-0 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="DRAFT">下書き</option>
                    <option value="PENDING">非公開</option>
                    <option value="PUBLISHED">公開</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">情報ソース</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {source.map((s) => (
                      <div key={s} className="inline-flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                        <BookOpen size={12} className="mr-1" />
                        <span className="truncate max-w-[120px]">{s}</span>
                        <button
                          onClick={() => handleRemoveSource(s)}
                          className="ml-1 text-gray-600 hover:text-gray-800 flex-shrink-0"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowSourceList(!showSourceList)}
                      className="flex items-center text-sm px-2 py-1 rounded border bg-white hover:bg-gray-50"
                    >
                      <Plus size={14} className="mr-1" />
                      ソースを追加
                    </button>
                    {showSourceList && (
                      <div className="absolute z-10 mt-1 w-full max-w-64 bg-white rounded-md shadow-lg border py-1 max-h-48 overflow-y-auto">
                        {INFO_SOURCE_OPTIONS.filter(option => !source.includes(option.label))
                          .map((option) => (
                            <button
                              key={option.label}
                              onClick={() => {
                                handleAddSource(option);
                                setShowSourceList(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 truncate"
                            >
                              {option.label}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {category.map((g) => (
                      <div key={g} className={`inline-flex items-center ${getTagColor(g)} px-2 py-1 rounded-md text-xs`}>
                        <span className="truncate max-w-[120px]">{g}</span>
                        <button
                          onClick={() => handleRemoveCategory(g)}
                          className="ml-1 text-gray-600 hover:text-gray-800 flex-shrink-0"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowCategoryList(!showCategoryList)}
                      className="flex items-center text-sm px-2 py-1 rounded border bg-white hover:bg-gray-50"
                    >
                      <Plus size={14} className="mr-1" />
                      カテゴリを追加
                    </button>
                    {showCategoryList && (
                      <div className="absolute z-10 mt-1 w-full max-w-64 bg-white rounded-md shadow-lg border py-1 max-h-48 overflow-y-auto">
                        {CATEGORY_OPTION.filter(option => !category.includes(option.label))
                          .map((option) => (
                            <button
                              key={option.label}
                              onClick={() => {
                                handleAddCategory(option);
                                setShowCategoryList(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 truncate"
                            >
                              {option.label}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 右側：質問内容・回答 */}
              <div className="lg:col-span-3 space-y-5 min-w-0">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    質問内容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="質問内容を入力"
                    rows={4}
                    className="w-full min-w-0 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    回答内容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="回答内容を入力"
                    rows={12}
                    className="w-full min-w-0 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                  <div className="mt-3">
                    <AiGenerateButton
                      onClick={handleGenerateAI}
                      disabled={getAIButtonStatus().disabled}
                      isLoading={isGeneratingAI}
                      tooltip={getAIButtonStatus().tooltip}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 px-4 py-3 bg-white border-t">
          <Button
            label="キャンセル"
            onClick={onClose}
            variant="outline"
            disabled={isSaving || isGeneratingAI}
          />
          <Button
            label={isSaving ? "保存中..." : "保存"}
            onClick={handleSave}
            disabled={isSaving || isGeneratingAI || !title || !question || !answer}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default QaCreateModal; 