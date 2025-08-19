# Storybook Sample Modern - 開発コマンド一覧

## 開発関連コマンド

### 開発サーバー
```bash
npm run dev              # Vite開発サーバー起動 (http://localhost:5173)
npm run storybook        # Storybook開発サーバー起動 (http://localhost:6006)
```

### ビルド
```bash
npm run build            # TypeScriptチェック + プロダクションビルド
npm run build-storybook  # Storybook静的サイトのビルド
npm run preview          # プロダクションビルドのプレビュー
```

## テスト関連コマンド

### テスト実行
```bash
npm run test             # 全テスト実行 (unit + Storybook)
npm run test:unit        # ユニットテストのみ実行
npm run test:stories     # Storybookテストのみ実行
npm run test:ui          # Vitest UIモードでテスト実行
npm run test:coverage    # カバレッジレポート生成
```

### 初期セットアップ（初回のみ）
```bash
npx playwright install --with-deps  # Playwrightのセットアップ
```

## コード品質チェック

### リント
```bash
npm run lint             # ESLintの実行
```

## システムコマンド（Darwin/macOS）

### Git関連
```bash
git status               # 現在の変更状態を確認
git diff                 # 変更内容の詳細を確認
git add .                # 全ての変更をステージング
git commit -m "message"  # コミット
git push                 # リモートへプッシュ
```

### ファイル操作
```bash
ls -la                   # ファイル一覧（隠しファイル含む）
find . -name "*.tsx"     # 特定の拡張子のファイルを検索
grep -r "pattern" .      # ディレクトリ内でパターン検索
```

### プロセス管理
```bash
lsof -i :6006           # ポート6006を使用しているプロセスを確認
kill -9 [PID]           # プロセスの強制終了
```

## タスク完了時に実行すべきコマンド

1. **コード品質チェック**
   ```bash
   npm run lint         # リントエラーがないことを確認
   ```

2. **型チェック**
   ```bash
   npm run build        # TypeScriptのコンパイルエラーがないことを確認
   ```

3. **テスト実行**
   ```bash
   npm run test         # 全てのテストが通ることを確認
   ```

これらのコマンドが全て成功することを確認してから、コードの提出やプルリクエストを作成してください。