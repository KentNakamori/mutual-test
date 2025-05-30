'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCompanies } from '@/hooks/useCompanies';   // ← 追加
import { fetcher } from '@/lib/fetcher';

const schema = z.object({
  companyId: z.coerce.number({ required_error: '企業を選択してください' }),
  email: z.string().email(),
  fullName: z.string().min(1, '氏名を入力してください'),
});
type Form = z.infer<typeof schema>;

export default function UserInvitePage() {
  /* 会社一覧を取得（共通フック経由） */
  const { companies, isLoading, isError } = useCompanies();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    await fetcher('/api/user-create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    alert('招待メールを送信しました');
    reset();
  };

  /* ロード・エラー表示 */
  if (isError)   return <p>会社一覧の取得に失敗しました</p>;
  if (isLoading) return <p>会社一覧を読み込み中...</p>;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold">企業ユーザー招待</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 border p-6 rounded-xl shadow"
      >
        {/* 企業プルダウン */}
        <div>
          <label className="block mb-1 font-medium">企業</label>
          <select
            {...register('companyId')}
            className="w-full border rounded p-2"
            defaultValue=""
          >
            <option value="" disabled>
              -- 企業を選択 --
            </option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.companyId && (
            <p className="text-red-600 text-sm">{errors.companyId.message}</p>
          )}
        </div>

        {/* 氏名 */}
        <div>
          <label className="block mb-1 font-medium">氏名</label>
          <input
            type="text"
            {...register('fullName')}
            className="w-full border rounded p-2"
          />
          {errors.fullName && (
            <p className="text-red-600 text-sm">{errors.fullName.message}</p>
          )}
        </div>

        {/* メールアドレス */}
        <div>
          <label className="block mb-1 font-medium">メールアドレス</label>
          <input
            type="email"
            {...register('email')}
            className="w-full border rounded p-2"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={isSubmitting}
        >
          招待メールを送信
        </button>
      </form>
    </div>
  );
}
