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
      "category": ["string"],
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

## 新規追加要件: Auth0統合ユーザー登録

### 1. データベーススキーマ更新

#### usersテーブルの更新
```sql
-- 新しいカラムを追加（既存のスキーマに合わせる）
ALTER TABLE users ADD COLUMN auth0_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT 'pending_activation';
ALTER TABLE users ADD COLUMN isAdmin BOOLEAN DEFAULT FALSE;

-- インデックスの追加（パフォーマンス向上）
CREATE INDEX idx_users_auth0_id ON users(auth0_id);
CREATE INDEX idx_users_status ON users(status);
```

#### statusフィールドの値
- `pending_activation`: 招待メール送信済み、パスワード未設定
- `active`: アクティブユーザー（ログイン可能）
- `inactive`: 非アクティブユーザー
- `suspended`: 一時停止

### 2. 新規エンドポイント: メールアドレス重複チェック

#### GET /admin/user/check-email
**目的**: ユーザー登録前の重複チェック

**リクエストパラメータ**:
```
email: string (required) - チェックするメールアドレス
```

**レスポンス**:
```json
{
  "exists": boolean
}
```

**エラーレスポンス**:
- 500: サーバーエラー

### 3. 既存エンドポイント修正: ユーザー登録

#### POST /admin/user/register
**目的**: Auth0統合ユーザー登録（データベース登録のみ）

**重要な変更点**:
- **Auth0ユーザー作成は行わない**（フロントエンドで実行済み）
- Auth0ユーザーIDを受け取ってデータベースに保存
- ステータス管理を追加

**リクエストボディ**:
```json
{
  "email": "user@example.com",
  "companyId": "123",
  "auth0_id": "auth0|60f7da8c4f2e8b0068b5c8a1",
  "isAdmin": false,
  "status": "pending_activation"
}
```

**処理仕様**:
1. メールアドレスの重複チェック
2. Auth0ユーザーIDの重複チェック
3. 企業の存在確認
4. ユーザー情報をデータベースに保存

**成功レスポンス** (201):
```json
{
  "message": "ユーザーが正常に登録されました",
  "_id": "68388fbf9a8da2d87b2d56c1",
  "auth0_id": "auth0|60f7da8c4f2e8b0068b5c8a1",
  "email": "user@example.com",
  "companyId": "68388fb99a8da2d87b2d56bc",
  "isAdmin": false,
  "status": "pending_activation",
  "createdAt": "2025-05-29T16:47:53.542+00:00"
}
```

**エラーレスポンス**:
- 400: バリデーションエラー
- 404: 企業が見つからない
- 409: メールアドレスまたはAuth0ユーザーIDが既に存在
- 500: サーバーエラー

### 4. Pydanticモデル例

```python
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegistrationRequest(BaseModel):
    email: EmailStr
    companyId: str
    auth0_id: str
    isAdmin: bool
    status: str = "pending_activation"

class UserRegistrationResponse(BaseModel):
    message: str
    _id: str
    auth0_id: str
    email: str
    companyId: str
    isAdmin: bool
    status: str
    createdAt: str

class EmailCheckResponse(BaseModel):
    exists: bool
```

### 5. データベースモデル例

```python
# MongoDBの場合
class User(BaseModel):
    _id: ObjectId
    email: str
    companyId: str
    auth0_id: str
    isAdmin: bool = False
    status: str = "pending_activation"
    createdAt: datetime
    
# SQLAlchemyの場合
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    companyId = Column(String(255), nullable=False)  # 既存の形式に合わせる
    auth0_id = Column(String(255), unique=True, index=True, nullable=False)
    isAdmin = Column(Boolean, default=False, nullable=False)
    status = Column(String(50), default="pending_activation", nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow)
```

### 6. 実装優先度

**高優先度**:
1. データベーススキーマ更新
2. `/admin/user/check-email` エンドポイント実装
3. `/admin/user/register` エンドポイント修正

**中優先度**:
4. エラーハンドリングの強化
5. ログ出力の追加

### 7. テスト要件

#### 単体テスト
- メールアドレス重複チェック機能
- ユーザー登録機能（正常系・異常系）
- バリデーション機能

#### 結合テスト
- フロントエンドとの連携テスト
- Auth0との連携確認

### 8. セキュリティ考慮事項

- Auth0ユーザーIDの検証
- SQLインジェクション対策
- 入力値のサニタイゼーション
- レート制限の実装（推奨）

### 9. パフォーマンス考慮事項

- データベースインデックスの最適化
- 重複チェッククエリの最適化
- 接続プールの設定確認 