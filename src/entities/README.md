# Entities Layer - 実装ガイド

## ⚠️ 重要な注意

**このディレクトリは実装例のサンプルです。** 現在のプロジェクトでは使用されておらず、すべてのContact関連ロジックは `features/contact` 層で管理されています。

## Entities層とは

Feature-Sliced Designにおけるentities層は、**ビジネスエンティティとドメインロジック**を管理する層です。

### いつEntities層を使うべきか

✅ **使うべき場合:**
- 複雑なビジネスルールや計算ロジックがある
- API連携でエンティティの状態管理が必要
- 複数のfeatureで共通して使用されるドメインロジック
- データベースとのマッピングが必要
- ドメイン駆動設計（DDD）を採用している

✅ **具体例:**
```typescript
// ユーザーエンティティ
class User {
  calculateAge(): number { /* ビジネスロジック */ }
  canAccessFeature(feature: string): boolean { /* 権限チェック */ }
  isSubscriptionExpired(): boolean { /* サブスクリプション判定 */ }
}

// 商品エンティティ  
class Product {
  calculateDiscountPrice(discountRate: number): number { /* 価格計算 */ }
  isInStock(): boolean { /* 在庫チェック */ }
  canBeOrderedBy(user: User): boolean { /* 注文可能判定 */ }
}
```

### いつEntities層を使わないべきか

❌ **使わない場合:**
- シンプルなフォーム入力だけのアプリ
- API連携がない
- ローカル状態のみの管理
- バリデーションだけの簡単なロジック

❌ **現在のプロジェクトの場合:**
- お問い合わせフォームの入力・バリデーションのみ
- LocalStorageへの保存だけ
- 複雑なビジネスルールなし
- 他の機能との共有ロジックなし

## サンプル実装の内容

`src/entities/contact/` には以下のサンプルが含まれています：

### 1. エンティティクラス (`contact.entity.ts`)
```typescript
class Contact {
  // ビジネスロジック例
  calculateAutoPriority(): ContactPriority
  calculateAutoCategory(): ContactCategory  
  canChangeStatusTo(newStatus: ContactStatus): boolean
  isSLAViolated(): boolean
}
```

### 2. 型定義 (`contact.types.ts`)
```typescript
interface ContactEntity {
  id: string;
  status: ContactStatus;
  priority: ContactPriority;
  // ... その他のプロパティ
}
```

## アーキテクチャの依存関係

```
app/     ← 最上位層
pages/   ← ページ層  
widgets/ ← ウィジェット層
features/ ← 機能層
entities/ ← エンティティ層（このサンプル）
shared/  ← 共有層（最下位）
```

## まとめ

- 現在のプロジェクト = **entities層不要** （features層で十分）
- より複雑なドメインロジック = **entities層を検討**
- このサンプル = **実装時の参考例として活用**