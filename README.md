# Simple Test Workshop - テスト実践ワークショップ

## ワークショップの目標

このワークショップでは、ユーザー視点でのテスト作成を実践的に学びます。

### 学習内容
1. ユーザーストーリーからシナリオを考える思考法
2. Vitestでのシンプルなテスト作成
3. Storybookでのコンポーネント確認・テスト
4. Play Functionでの自動化されたユーザーシナリオテスト
5. TDD（テスト駆動開発）での新機能追加

---

## クイックスタート

### 環境要件
- Node.js 18以上（推奨: 20以上）
- npm または yarn

### セットアップ
```bash
# 1. リポジトリのクローン
git clone <repository-url>
cd simple-test-workshop

# 2. 依存関係のインストール
npm install

# 3. 開発サーバーの起動
npm run dev        # http://localhost:5173

# 4. Storybookの起動
npm run storybook  # http://localhost:6006  

# 5. テストの実行
npm run test       # 全テスト実行
```

---

## ワークショップの流れ

### Phase 1: セットアップ
環境構築と動作確認

### Phase 2: Vitestでテストを書く
- ユーティリティ関数のテスト
- コンポーネントのテスト
- 実践演習

### Phase 3: Storybookストーリーを作る
- コンポーネントカタログの作成
- 様々な状態の可視化
- ストーリーの追加演習

### Phase 4: Play Functionで自動テスト
- ユーザー操作の自動化
- シナリオベースのテスト
- インタラクションテストの実装

### Phase 5: TDDで新機能を追加
- RED → GREEN → REFACTOR サイクル
- TodoItemに編集機能を追加
- テスト駆動開発の実践

---

## プロジェクト構成

```
simple-test-workshop-v2/
├── src/
│   ├── components/        # UIコンポーネント
│   │   ├── TodoItem/      # Todoアイテム
│   │   ├── Counter/       # カウンター
│   │   └── UserCard/      # ユーザーカード
│   ├── utils/             # ユーティリティ関数
│   └── test/              # テスト設定
├── workshop/              # ワークショップ資料
│   ├── exercises/         # 段階的な練習問題
```

---

## 主要なコマンド

```bash
# 開発
npm run dev               # Vite開発サーバー起動
npm run storybook         # Storybook起動

# テスト
npm run test              # 全テスト実行
npm run test:unit         # ユニットテストのみ
npm run test:stories      # Storybookテストのみ

# ビルド
npm run build             # プロダクションビルド
npm run build-storybook   # Storybookビルド
```

---

## 学習リソース

### ワークショップ資料
- **exercises/** - 段階的な練習問題
  - step1-first-test.md - 初めてのテスト
  - step2-storybook-story.md - Storybook入門
  - step3-user-scenario.md - シナリオテスト
  - step4-tdd-practice.md - TDD実践

### 実装されているコンポーネント

#### TodoItem
- タスクの完了状態管理
- タスクの削除機能
- アクセシビリティ対応

#### Counter
- 数値の増減機能
- 最小値・最大値の制約
- リセット機能

#### UserCard
- ユーザー情報の表示
- オンライン状態の表示
- アバター画像の対応