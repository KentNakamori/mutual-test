import React, { useState } from 'react';

interface MeetingNotesProps {
  notes: string;
  onNotesUpdate: (notes: string) => void;
}

export const MeetingNotes: React.FC<MeetingNotesProps> = ({
  notes,
  onNotesUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingNotes, setEditingNotes] = useState(notes);

  const handleEdit = () => {
    setIsEditing(true);
    setEditingNotes(notes);
  };

  const handleSave = async () => {
    await onNotesUpdate(editingNotes);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingNotes(notes);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold leading-relaxed">
          議事録・メモ
        </h3>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            編集
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={editingNotes}
            onChange={(e) => setEditingNotes(e.target.value)}
            className="w-full h-64 p-4 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            placeholder="議事録やメモを入力してください"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm text-white bg-black hover:bg-gray-900 transition-colors duration-200 rounded"
            >
              保存
            </button>
          </div>
        </div>
      ) : (
        <div className="prose prose-gray max-w-none">
          {notes ? (
            <div className="whitespace-pre-wrap">{notes}</div>
          ) : (
            <p className="text-gray-500">議事録・メモはまだありません</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MeetingNotes;
