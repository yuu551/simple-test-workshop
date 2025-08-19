# API設計書

## 概要

問い合わせフォームアプリケーションのAPI仕様を定義します。現在の実装はフロントエンドのみですが、将来のバックエンドAPI統合に向けた設計指針とインターフェース定義を示します。

## API設計方針

### 1. RESTful API設計

- **リソース指向**: URIでリソースを識別
- **HTTPメソッド**: 標準的なCRUD操作
- **ステータスコード**: 適切なHTTP応答コード
- **JSON形式**: リクエスト・レスポンス形式

### 2. セキュリティ設計

- **HTTPS必須**: 全通信の暗号化
- **CORS設定**: 適切なオリジン制限
- **レート制限**: スパム防止
- **入力検証**: サーバーサイドバリデーション

## エンドポイント仕様

### POST /api/contacts

**用途**: 問い合わせフォームの送信

#### リクエスト仕様

```http
POST /api/contacts
Content-Type: application/json
```

```typescript
interface ContactSubmissionRequest {
  name: string;              // お名前 (1-100文字)
  email: string;             // メールアドレス (1-255文字、メール形式)
  subject: string;           // 件名 (1-200文字)
  message: string;           // お問い合わせ内容 (10-2000文字)
  privacyPolicy: boolean;    // プライバシーポリシー同意 (true必須)
}
```

#### リクエスト例

```json
{
  "name": "田中太郎",
  "email": "tanaka@example.com",
  "subject": "サービスについて",
  "message": "詳細を教えてください。こちらは10文字以上のメッセージです。",
  "privacyPolicy": true
}
```

#### レスポンス仕様

**成功時 (201 Created)**

```typescript
interface ContactSubmissionResponse {
  success: true;
  data: {
    id: string;              // 問い合わせID
    submittedAt: string;     // 送信日時 (ISO 8601)
    status: 'received';      // 受付状況
  };
  message: string;           // 成功メッセージ
}
```

```json
{
  "success": true,
  "data": {
    "id": "contact_1234567890",
    "submittedAt": "2024-01-15T10:30:00.000Z",
    "status": "received"
  },
  "message": "お問い合わせを受け付けました"
}
```

**バリデーションエラー (400 Bad Request)**

```typescript
interface ValidationErrorResponse {
  success: false;
  error: {
    code: 'VALIDATION_ERROR';
    message: string;
    details: ValidationError[];
  };
}

interface ValidationError {
  field: keyof ContactSubmissionRequest;
  message: string;
  received?: any;
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力データに問題があります",
    "details": [
      {
        "field": "name",
        "message": "お名前は必須です",
        "received": ""
      },
      {
        "field": "email",
        "message": "有効なメールアドレスを入力してください",
        "received": "invalid-email"
      }
    ]
  }
}
```

**レート制限エラー (429 Too Many Requests)**

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "リクエストが多すぎます。しばらく時間をおいてからお試しください",
    "retryAfter": 60
  }
}
```

**サーバーエラー (500 Internal Server Error)**

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "サーバー内部エラーが発生しました。時間をおいて再度お試しください"
  }
}
```

## データモデル

### Contact Entity

```typescript
interface Contact {
  id: string;                    // 一意識別子
  name: string;                  // お名前
  email: string;                 // メールアドレス
  subject: string;               // 件名
  message: string;               // お問い合わせ内容
  privacyPolicy: boolean;        // プライバシーポリシー同意
  status: ContactStatus;         // 処理状況
  submittedAt: Date;            // 送信日時
  processedAt?: Date;           // 処理完了日時
  assignedTo?: string;          // 担当者ID
  response?: string;            // 回答内容
  tags?: string[];              // タグ
  priority: 'low' | 'medium' | 'high'; // 優先度
}

enum ContactStatus {
  RECEIVED = 'received',         // 受信済み
  IN_PROGRESS = 'in_progress',   // 対応中
  RESOLVED = 'resolved',         // 解決済み
  CLOSED = 'closed'              // 完了
}
```

### バリデーションスキーマ

```typescript
// サーバーサイドバリデーション (Zod)
export const contactSubmissionSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'お名前は必須です')
    .max(100, '名前は100文字以内で入力してください'),
  
  email: z.string()
    .trim() 
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください')
    .max(255, 'メールアドレスは255文字以内で入力してください'),
  
  subject: z.string()
    .trim()
    .min(1, '件名は必須です')
    .max(200, '件名は200文字以内で入力してください'),
  
  message: z.string()
    .trim()
    .min(10, 'お問い合わせ内容は10文字以上で入力してください')
    .max(2000, 'お問い合わせ内容は2000文字以内で入力してください'),
  
  privacyPolicy: z.boolean()
    .refine(val => val === true, 'プライバシーポリシーへの同意が必要です')
});

export type ContactSubmissionRequest = z.infer<typeof contactSubmissionSchema>;
```

## エラーハンドリング仕様

### HTTPステータスコード

| ステータス | 説明 | 使用場面 |
|-----------|------|----------|
| 201 | Created | 問い合わせ送信成功 |
| 400 | Bad Request | バリデーションエラー、不正な形式 |
| 401 | Unauthorized | 認証が必要な場合 |
| 403 | Forbidden | アクセス権限なし |
| 422 | Unprocessable Entity | バリデーション詳細エラー |
| 429 | Too Many Requests | レート制限超過 |
| 500 | Internal Server Error | サーバー内部エラー |
| 503 | Service Unavailable | メンテナンス中 |

### エラーレスポンス統一形式

```typescript
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;              // エラーコード
    message: string;           // ユーザー向けメッセージ
    details?: any;             // 詳細情報（開発用）
    traceId?: string;          // トレースID（ログ用）
    timestamp: string;         // エラー発生時刻
  };
}
```

### バリデーションエラー詳細

```typescript
interface ValidationErrorDetail {
  field: string;               // エラーフィールド名
  message: string;             // エラーメッセージ
  code: ValidationErrorCode;   // エラーコード
  received?: any;              // 受信した値
  expected?: any;              // 期待する値
}

enum ValidationErrorCode {
  REQUIRED = 'REQUIRED',                    // 必須項目未入力
  INVALID_FORMAT = 'INVALID_FORMAT',        // 形式不正
  TOO_SHORT = 'TOO_SHORT',                 // 文字数不足
  TOO_LONG = 'TOO_LONG',                   // 文字数超過
  INVALID_EMAIL = 'INVALID_EMAIL',         // メール形式エラー
  AGREEMENT_REQUIRED = 'AGREEMENT_REQUIRED' // 同意必須
}
```

## セキュリティ仕様

### 1. 入力検証

**フロントエンド検証**
- Zodスキーマによるクライアントサイド検証
- TypeScript型チェック
- リアルタイムバリデーション

**バックエンド検証**
- 同一Zodスキーマによるサーバーサイド検証
- SQL インジェクション対策
- XSS対策（HTMLエスケープ）

### 2. レート制限

```typescript
interface RateLimit {
  windowMs: number;      // 時間窓 (ミリ秒)
  max: number;          // 最大リクエスト数
  message: string;      // 制限時メッセージ
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

// 実装例
const contactRateLimit: RateLimit = {
  windowMs: 15 * 60 * 1000,  // 15分間
  max: 5,                    // 最大5回
  message: 'リクエストが多すぎます。15分後に再度お試しください'
};
```

### 3. CORS設定

```typescript
interface CorsOptions {
  origin: string[];          // 許可するオリジン
  methods: string[];         // 許可するメソッド
  allowedHeaders: string[];  // 許可するヘッダー
  credentials: boolean;      // 認証情報の許可
}

const corsOptions: CorsOptions = {
  origin: [
    'https://example.com',
    'https://www.example.com'
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};
```

## 通知・統合仕様

### 1. メール通知

**管理者宛通知**
```typescript
interface AdminNotification {
  to: string[];              // 管理者メールアドレス
  subject: string;           // 件名
  template: 'new_contact';   // テンプレート名
  data: {
    contactId: string;
    submitterName: string;
    submitterEmail: string;
    subject: string;
    submittedAt: string;
    priority: 'low' | 'medium' | 'high';
  };
}
```

**自動返信メール**
```typescript
interface AutoReply {
  to: string;                // 送信者メールアドレス
  subject: string;           // 件名
  template: 'contact_received'; // テンプレート名
  data: {
    name: string;
    contactId: string;
    submittedAt: string;
  };
}
```

### 2. 外部システム連携

**CRM統合**
```typescript
interface CrmIntegration {
  endpoint: string;          // CRM API エンドポイント
  apiKey: string;           // API キー
  mapping: {                // フィールドマッピング
    name: string;
    email: string;
    company?: string;
    source: 'website_contact';
  };
}
```

**Slack通知**
```typescript
interface SlackNotification {
  webhookUrl: string;       // Slack Webhook URL
  channel: string;          // 通知チャンネル
  template: {
    text: string;
    blocks: SlackBlock[];
  };
}
```

## データベース設計

### 1. テーブル構造

```sql
-- contacts テーブル
CREATE TABLE contacts (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  privacy_policy BOOLEAN NOT NULL DEFAULT false,
  status ENUM('received', 'in_progress', 'resolved', 'closed') DEFAULT 'received',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP NULL,
  assigned_to VARCHAR(255) NULL,
  response TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_submitted_at (submitted_at),
  INDEX idx_assigned_to (assigned_to)
);

-- contact_tags テーブル (多対多)
CREATE TABLE contact_tags (
  contact_id VARCHAR(255),
  tag_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (contact_id, tag_id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

-- tags テーブル
CREATE TABLE tags (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  color VARCHAR(7), -- HEX color code
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. データ保持・削除ポリシー

```typescript
interface DataRetentionPolicy {
  activeRetention: number;    // アクティブデータ保持期間（日）
  archiveRetention: number;   // アーカイブデータ保持期間（日）
  anonymizeAfter: number;     // 匿名化処理期間（日）
  purgeAfter: number;         // 完全削除期間（日）
}

const retentionPolicy: DataRetentionPolicy = {
  activeRetention: 365,       // 1年間
  archiveRetention: 2555,     // 7年間
  anonymizeAfter: 1095,       // 3年後に匿名化
  purgeAfter: 2555           // 7年後に完全削除
};
```

## APIクライアント実装

### 1. TypeScript クライアント

```typescript
class ContactApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string, timeout = 10000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  async submitContact(data: ContactSubmissionRequest): Promise<ContactSubmissionResponse> {
    const response = await fetch(`${this.baseUrl}/api/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(this.timeout),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(response.status, errorData);
    }

    return await response.json();
  }
}

class ApiError extends Error {
  constructor(
    public statusCode: number,
    public errorResponse: ApiErrorResponse
  ) {
    super(errorResponse.error.message);
    this.name = 'ApiError';
  }
}
```

### 2. React Hook統合

```typescript
import { useMutation } from '@tanstack/react-query';

export function useSubmitContact() {
  const client = new ContactApiClient(process.env.REACT_APP_API_BASE_URL!);

  return useMutation({
    mutationFn: (data: ContactSubmissionRequest) => client.submitContact(data),
    onSuccess: (response) => {
      // 成功時処理
      console.log('Contact submitted:', response.data.id);
    },
    onError: (error: ApiError) => {
      // エラー時処理
      console.error('Submission failed:', error.errorResponse);
    },
  });
}
```

## テスト戦略

### 1. APIテスト

```typescript
// API統合テスト例
describe('Contact API', () => {
  const client = new ContactApiClient('http://localhost:3001');

  it('正常なデータで問い合わせを送信できる', async () => {
    const requestData: ContactSubmissionRequest = {
      name: '田中太郎',
      email: 'tanaka@example.com',
      subject: 'テスト件名',
      message: 'これは10文字以上のテストメッセージです。',
      privacyPolicy: true
    };

    const response = await client.submitContact(requestData);

    expect(response.success).toBe(true);
    expect(response.data.id).toMatch(/^contact_/);
    expect(response.data.status).toBe('received');
  });

  it('バリデーションエラーで適切なエラーが返る', async () => {
    const invalidData = {
      name: '',  // 必須項目が空
      email: 'invalid-email',
      subject: 'テスト',
      message: '短い',  // 10文字未満
      privacyPolicy: false
    };

    await expect(client.submitContact(invalidData))
      .rejects.toThrow(ApiError);
  });
});
```

### 2. モック戦略

```typescript
// MSW (Mock Service Worker) 設定
export const handlers = [
  rest.post('/api/contacts', (req, res, ctx) => {
    const body = req.body as ContactSubmissionRequest;
    
    // バリデーションシミュレーション
    if (!body.name) {
      return res(
        ctx.status(400),
        ctx.json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '入力データに問題があります',
            details: [
              { field: 'name', message: 'お名前は必須です' }
            ]
          }
        })
      );
    }

    // 成功レスポンス
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: {
          id: `contact_${Date.now()}`,
          submittedAt: new Date().toISOString(),
          status: 'received'
        },
        message: 'お問い合わせを受け付けました'
      })
    );
  }),
];
```

## 監視・ロギング

### 1. APIメトリクス

```typescript
interface ApiMetrics {
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
  userId?: string;
  userAgent?: string;
  ip?: string;
}
```

### 2. ログ形式

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "Contact submitted successfully",
  "data": {
    "contactId": "contact_1234567890",
    "email": "tanaka@example.com",
    "subject": "サービスについて",
    "responseTime": 245,
    "ip": "192.168.1.1"
  }
}
```

## パフォーマンス要件

### 1. レスポンス目標

| メトリクス | 目標値 | 測定方法 |
|-----------|--------|----------|
| API応答時間 | < 500ms | サーバーログ |
| データベース検索 | < 100ms | クエリログ |
| メール送信 | < 2s | 非同期処理 |
| 同時リクエスト処理 | 1000req/s | 負荷テスト |

### 2. 最適化戦略

- **データベース**: インデックス最適化、クエリチューニング
- **API**: レスポンスキャッシュ、CDN活用
- **メール**: キュー処理、バッチ送信
- **モニタリング**: APM ツールによる監視