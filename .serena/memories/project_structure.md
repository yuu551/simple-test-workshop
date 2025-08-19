# プロジェクト構造

## ルートディレクトリ構成

```
story-book-sample-modern/
├── .claude/              # Claude Code関連の設定
├── public/               # 静的ファイル
├── src/                  # ソースコード
├── .gitignore           # Git除外設定
├── .mcp.json            # MCP設定
├── CLAUDE.md            # Claude Code用プロジェクト指示
├── README.md            # プロジェクト説明
├── TEST_STRATEGY.md     # テスト戦略ドキュメント
├── WORKSHOP_GUIDE.md    # ワークショップガイド
├── WORKSHOP_REFERENCE.md # ワークショップリファレンス
├── eslint.config.js     # ESLint設定
├── index.html           # エントリーHTML
├── package.json         # 依存関係・スクリプト定義
├── package-lock.json    # 依存関係ロックファイル
├── tsconfig.json        # TypeScript設定（ルート）
├── tsconfig.app.json    # TypeScript設定（アプリ用）
├── tsconfig.node.json   # TypeScript設定（Node用）
├── vite.config.ts       # Vite設定
├── vitest.config.ts     # Vitest設定
├── vitest.shims.d.ts    # Vitest型定義
└── vitest.simple.config.ts # Vitest簡易設定
```

## src/ディレクトリ構成

```
src/
├── assets/              # 画像などの静的アセット
│   └── react.svg
├── components/          # Reactコンポーネント
│   └── ContactForm/     # お問い合わせフォームコンポーネント
│       ├── ContactForm.tsx         # コンポーネント本体
│       ├── ContactForm.css         # スタイル定義
│       ├── ContactForm.stories.tsx # Storybook定義
│       ├── ContactForm.test.tsx    # ユニットテスト
│       ├── validation.ts           # Zodスキーマ定義
│       ├── validation.test.ts      # バリデーションテスト
│       └── index.ts               # バレルエクスポート
├── stories/             # Storybookサンプルストーリー
│   ├── assets/          # Storybook用アセット
│   ├── Button.tsx       # ボタンコンポーネント例
│   ├── Header.tsx       # ヘッダーコンポーネント例
│   ├── Page.tsx         # ページコンポーネント例
│   └── Configure.mdx    # Storybook設定ドキュメント
├── test/                # テスト関連設定
│   └── setup.ts         # テストセットアップ
├── user-stories/        # ユーザーストーリー定義
│   ├── testData.ts      # テストデータ定義
│   ├── testData.test.ts # テストデータのテスト
│   └── userStories.ts   # ユーザーストーリー定義
├── App.tsx              # アプリケーションルートコンポーネント
├── App.css              # アプリケーションスタイル
├── main.tsx             # エントリーポイント
├── index.css            # グローバルスタイル
└── vite-env.d.ts        # Vite環境型定義
```

## 主要な設計パターン

### コンポーネント構成
- **機能ベースのディレクトリ構造**: 各機能（ContactFormなど）ごとにディレクトリを作成
- **コロケーション**: コンポーネントと関連ファイル（テスト、スタイル、Story）を同じディレクトリに配置
- **バレルエクスポート**: index.tsで公開APIを制御

### テスト構成
- **ユニットテスト**: `*.test.tsx`ファイルでコンポーネントと同じディレクトリに配置
- **Storybookテスト**: `*.stories.tsx`ファイルでPlay Functionを定義
- **ユーザーストーリー**: `user-stories/`ディレクトリで一元管理

### 設定ファイル
- **TypeScript**: プロジェクト参照を使用してapp用とnode用を分離
- **Vitest**: プロジェクト機能でunitとstorybookテストを分離
- **ESLint**: Flat Config形式で設定