import React from 'react';

export type QACardMode = 'preview' | 'detail' | 'edit';
export type QACardRole = 'investor' | 'corporate';

export interface QAData {
  id: string;
  title: string;
  question: string;
  answer: string;
  createdAt: string;
  views: number;
  likeCount: number;
  tags?: string[];       // 資料からのタグ
  genreTags?: string[];  // ジャンル分類用タグ
  updatedAt?: string;
}

export interface QACardProps {
  mode: QACardMode;
  role: QACardRole;
  qa: QAData;
  // プレビュー/詳細用のハンドラ
  onSelect?: (id: string) => void;
  // 詳細モードで使用するハンドラ
  onLike?: (id: string) => void;
  // 企業向けの場合のハンドラ
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  // 編集モードで使用するハンドラ
  onCancelEdit?: () => void;
  onSaveEdit?: (updatedQa: QAData) => void;
}

const QACard: React.FC<QACardProps> = ({
  mode,
  role,
  qa,
  onSelect,
  onLike,
  onEdit,
  onDelete,
  onCancelEdit,
  onSaveEdit,
}) => {
  // プレビュー状態：タイトル、回答の一部、タグ、公開日、いいね数（いいねボタンは不要）
  if (mode === 'preview') {
    return (
      <div
        className="border p-4 rounded cursor-pointer hover:shadow-lg transition-shadow duration-200"
        onClick={() => onSelect && onSelect(qa.id)}
      >
        <h4 className="text-lg font-semibold">{qa.title}</h4>
        <p className="text-sm"> {qa.answer ? qa.answer.substring(0, 100) : ""} …</p>

        <div className="text-xs text-gray-500 mt-2">
          <span>公開日: {qa.createdAt}</span>
          {qa.tags && <span className="ml-2">タグ: {qa.tags.join(', ')}</span>}
          <span className="ml-2">いいね: {qa.likeCount}</span>
        </div>
      </div>
    );
  }

  // 詳細状態：タイトル、質問、回答、タグ、ジャンルタグ、公開日、いいね数＋アクションボタン（いいねは共通。企業向けは編集/削除も）
  if (mode === 'detail') {
    return (
      <div className="border p-4 rounded">
        <h4 className="text-lg font-semibold">{qa.title}</h4>
        <div className="mt-2">
          <strong>質問:</strong>
          <p>{qa.question}</p>
        </div>
        <div className="mt-2">
          <strong>回答:</strong>
          <p>{qa.answer}</p>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {qa.tags && <div>資料タグ: {qa.tags.join(', ')}</div>}
          {qa.genreTags && <div>ジャンルタグ: {qa.genreTags.join(', ')}</div>}
          <div>公開日: {qa.createdAt}</div>
          <div>いいね数: {qa.likeCount}</div>
        </div>
        <div className="mt-4">
          {onLike && (
            <button
              onClick={() => onLike(qa.id)}
              className="mr-2 bg-black text-white py-1 px-3 rounded"
            >
              いいね
            </button>
          )}
          {role === 'corporate' && onEdit && (
            <button
              onClick={() => onEdit(qa.id)}
              className="mr-2 bg-blue-500 text-white py-1 px-3 rounded"
            >
              編集
            </button>
          )}
          {role === 'corporate' && onDelete && (
            <button
              onClick={() => onDelete(qa.id)}
              className="bg-red-500 text-white py-1 px-3 rounded"
            >
              削除
            </button>
          )}
        </div>
      </div>
    );
  }

  // 編集状態：入力欄で編集可能。ファイル添付は省略。キャンセルと保存ボタンを表示
  if (mode === 'edit') {
    const [title, setTitle] = React.useState(qa.title);
    const [question, setQuestion] = React.useState(qa.question);
    const [answer, setAnswer] = React.useState(qa.answer);
    const [tags, setTags] = React.useState(qa.tags || []);
    const [genreTags, setGenreTags] = React.useState(qa.genreTags || []);

    return (
      <div className="border p-4 rounded">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 border p-2"
          placeholder="タイトル"
        />
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full mb-2 border p-2"
          placeholder="質問文"
        />
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full mb-2 border p-2"
          placeholder="回答文"
        />
        <div className="mb-2">
          <input
            type="text"
            value={tags.join(", ")}
            onChange={(e) =>
              setTags(e.target.value.split(",").map((s) => s.trim()))
            }
            className="w-full border p-2"
            placeholder="資料タグ（カンマ区切り）"
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            value={genreTags.join(", ")}
            onChange={(e) =>
              setGenreTags(e.target.value.split(",").map((s) => s.trim()))
            }
            className="w-full border p-2"
            placeholder="ジャンルタグ（カンマ区切り）"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancelEdit}
            className="py-1 px-3 border rounded"
          >
            キャンセル
          </button>
          <button
            onClick={() =>
              onSaveEdit &&
              onSaveEdit({
                ...qa,
                title,
                question,
                answer,
                tags,
                genreTags,
                updatedAt: new Date().toISOString(),
              })
            }
            className="py-1 px-3 bg-black text-white rounded"
          >
            保存
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default QACard;
