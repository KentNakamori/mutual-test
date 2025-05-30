# バックエンドAPI実装要件

## 企業ごとの最新QA取得API

### エンドポイント
```
GET /investor/qa/latest-by-company
```

### 概要
各企業の最新QAを1つずつ取得し、その中から作成日時の新しいものを指定された件数分返すAPIです。

### リクエストパラメータ
| パラメータ | 型 | 必須 | デフォルト値 | 説明 |
|-----------|---|------|-------------|------|
| limit | number | No | 10 | 取得する企業数の上限 |

### 処理仕様
1. **企業ごとの最新QA取得**
   - 各企業（companyId）ごとに最新のQAを1つずつ取得
   - 最新の判定は`createdAt`フィールドで行う
   - ステータスが`published`のQAのみを対象とする

2. **ソートと制限**
   - 取得した企業ごとの最新QAを`createdAt`の降順（新しい順）でソート
   - `limit`パラメータで指定された件数分を返す

3. **レスポンス形式**
```json
{
  "results": [
    {
      "qaId": "string",
      "title": "string",
      "question": "string",
      "answer": "string",
      "companyId": "string",
      "companyName": "string",
      "likeCount": 0,
      "question_route": "string",
      "source": ["string"],
      "genre": ["string"],
      "fiscalPeriod": "string",
      "reviewStatus": "PUBLISHED",
      "status": "published",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "totalCount": 10,
  "totalPages": 1
}
```

### SQLクエリ例（参考）
```sql
WITH latest_qa_per_company AS (
  SELECT 
    qa.*,
    ROW_NUMBER() OVER (PARTITION BY companyId ORDER BY createdAt DESC) as rn
  FROM qa_table qa
  WHERE status = 'published'
)
SELECT *
FROM latest_qa_per_company
WHERE rn = 1
ORDER BY createdAt DESC
LIMIT ?;
```

### エラーレスポンス
- **400 Bad Request**: 不正なパラメータ
- **500 Internal Server Error**: サーバーエラー

### 認証
- 投資家ユーザーの認証が必要
- ゲストユーザーでもアクセス可能（認証トークンなしでも動作）

### パフォーマンス考慮事項
- `companyId`と`createdAt`にインデックスを設定
- `status`フィールドにもインデックスを設定
- 大量データに対応するため、適切なクエリ最適化を実施

### 実装優先度
**高** - 投資家向けトップページの新着QA表示で使用される重要な機能 