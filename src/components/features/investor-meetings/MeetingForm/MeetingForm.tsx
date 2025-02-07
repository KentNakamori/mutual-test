'use client'

import React from 'react';
import { InvestorSelect } from '../shared/InvestorSelect';
import { StatusBadge } from '../shared/StatusBadge';
import type { Meeting } from '@/types/models';
import { validateMeeting } from './MeetingValidation';

interface MeetingFormProps {
  initialData?: Partial<Meeting>;
  onSubmit: (data: Partial<Meeting>) => void;
  onCancel: () => void;
}

export const MeetingForm: React.FC<MeetingFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = React.useState({
    investorId: initialData?.investor_id || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
    time: initialData?.date ? new Date(initialData.date).toISOString().split('T')[1].slice(0, 5) : '',
    status: initialData?.status || 'scheduled',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateMeeting(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dateTime = new Date(`${formData.date}T${formData.time}`);
    
    onSubmit({
      investor_id: formData.investorId,
      date: dateTime.toISOString(),
      status: formData.status,
      notes: formData.notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-600">
          投資家
        </label>
        <InvestorSelect
          value={formData.investorId}
          onChange={(value) => setFormData({ ...formData, investorId: value || '' })}
          className="w-full"
        />
        {errors.investorId && (
          <p className="text-sm text-red-600">{errors.investorId}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="date" className="block text-sm font-medium text-gray-600">
            日付
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          />
          {errors.date && (
            <p className="text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="time" className="block text-sm font-medium text-gray-600">
            時間
          </label>
          <input
            type="time"
            id="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          />
          {errors.time && (
            <p className="text-sm text-red-600">{errors.time}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="status" className="block text-sm font-medium text-gray-600">
          ステータス
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          <option value="scheduled">予定済み</option>
          <option value="in_progress">進行中</option>
          <option value="completed">完了</option>
          <option value="cancelled">キャンセル</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-600">
          議事録・メモ
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded border border-gray-300 hover:border-gray-400"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm text-white bg-black hover:bg-gray-900 transition-colors duration-200 rounded"
        >
          保存
        </button>
      </div>
    </form>
  );
};

export default MeetingForm;