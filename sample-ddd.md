# 最新のStorybook 9.1とVitest統合対応のテスト戦略サンプルコード

最新のStorybook 9.1およびVitest統合機能に対応した、ユーザーストーリー駆動テストのサンプルコードを作成しました。

## 📋 作成したファイル一覧



package.json

生成されたファイル

## 🚀 主要な特徴

## 1. 最新のStorybook 9.1対応

- **@storybook/addon-vitest**: Storybook 9.1の正式なVitest統合アドオン
- **@storybook/test**: 統合されたテスティングライブラリ（Testing Library、Vitest Spy、Expectが統合）
- **Play Functions**: ユーザーインタラクションのテスト自動化

## 2. ユーザーストーリー駆動テスト

- **ユーザーストーリー定義**: `userStories.ts`でGiven-When-Then形式のストーリーを管理
- **テストデータ管理**: ストーリーIDとテストデータの連携
- **トレーサビリティ**: ユーザーストーリー ↔ テストケース ↔ 実装の対応関係を明確化

## 3. React Hook Form + Zod統合

- **型安全なバリデーション**: Zodスキーマからの型推論
- **リアルタイムバリデーション**: onBlurモードでのバリデーション
- **カスタムバリデーション**: ビジネスルール対応

## 4. テスト環境の分離

```
typescript
// vitest.config.ts - ワークスペース構成
export default defineWorkspace([
  // ユニットテスト（jsdom）
  {
    test: {
      name: 'unit',
      environment: 'jsdom'
    }
  },
  // Storybook テスト（Browser Mode）
  {
    test: {
      name: 'storybook',
      browser: {
        enabled: true,
        name: 'chromium'
      }
    }
  }
]);
```

## 📝 具体的なテスト実装例

## US-001: 問い合わせフォームから連絡を送信する

```
typescript
// ContactForm.stories.tsx
export const HappyPath: Story = {
  name: 'US-001-SC-001-1: 正常な送信フロー',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const testData = getTestDataByScenarioId('SC-001-1')!;

    // Given: 問い合わせフォームページを開いている
    await expect(canvas.getByLabelText(/お名前/i)).toBeInTheDocument();
    
    // When: 必要な情報を入力して送信ボタンをクリックする
    await userEvent.type(canvas.getByLabelText(/お名前/i), testData.name);
    await userEvent.type(canvas.getByLabelText(/メールアドレス/i), testData.email);
    await userEvent.click(canvas.getByRole('button', { name: /送信する/i }));
    
    // Then: onSubmitが呼ばれることを確認
    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: testData.name,
        email: testData.email
      })
    );
  }
};
```

## バリデーションのユニットテスト

```
typescript
// validation.test.ts
describe('validateContactForm', () => {
  it('有効なデータではエラーが返されない', async () => {
    const validData: ContactFormData = {
      name: '田中太郎',
      email: 'tanaka@example.com',
      message: 'テストメッセージです',
      privacyPolicy: true
    };

    const errors = await validateContactForm(validData);
    expect(errors).toHaveLength(0);
  });
});
```

## 🎯 実行方法

## セットアップ

```
bash
# 依存関係のインストール
npm install

# Storybookの起動
npm run storybook

# テストの実行
npm run test:all
```

## テストコマンド

```
bash
# ユニットテスト
npm run test

# Storybookテスト
npm run test:storybook

# カバレッジ付きテスト
npm run test:coverage

# UIモードでのテスト
npm run test:ui
```

## 🔧 設定のポイント

## 1. Storybook設定（.storybook/main.ts）

- **@storybook/addon-vitest**: Vitest統合アドオン
- **TypeScript設定**: react-docgen-typescriptを使用
- **自動ドキュメント**: autodocsタグ対応

## 2. Vitest統合設定

- **Browser Mode**: Playwright Chromiumを使用
- **セットアップファイル**: Storybook annotationsを読み込み
- **ワークスペース**: ユニットテストとStorybookテストを分離

## 3. React Hook Form統合

- **デコレーター**: StorybookでFormProviderを提供
- **バリデーション**: Zodスキーマによる型安全なバリデーション
- **自動保存**: LocalStorageを使った入力内容保存

## 📊 テストカバレッジ

- **ユニットテスト**: ビジネスロジック、バリデーション関数
- **コンポーネントテスト**: ユーザーストーリーベースのインタラクション
- **統合テスト**: フォーム送信フロー全体

## 🎨 特徴的な機能

## 1. ユーザーストーリー管理

```
typescript
// userStories.ts
export const contactFormStories: UserStory[] = [
  {
    id: 'US-001',
    title: '問い合わせフォームから連絡を送信する',
    scenarios: [
      {
        id: 'SC-001-1',
        given: '問い合わせフォームページを開いている',
        when: '名前「田中太郎」、メール「tanaka@example.com」を入力',
        then: '成功メッセージが表示される'
      }
    ]
  }
];
```### 2. 自動保存機能
- LocalStorageを使った下書き保存
- 1時間以内のデータ復元
- プライバシーに配慮した自動削除

### 3. 確認画面機能
- 入力内容の確認画面表示
- 確認画面からの修正機能
- 確認後の送信処理

このサンプルコードは、最新のStorybook 9.1とVitest統合機能を活用し、ユーザーストーリー駆動テストのベストプラクティスを実装した実用的な例となっています。React Hook FormとZodを使用した型安全なフォーム実装と、包括的なテスト戦略を組み合わせることで、保守性と品質を両立したフロントエンド開発を実現しています。
```

1. https://storybook.js.org/releases
2. https://storybook.js.org/docs/writing-stories/play-function
3. https://fireup.pro/news/storybook-8-whats-new
4. https://storybook.js.org/blog/storybook-8/
5. https://www.youtube.com/watch?v=dcuzwCHI940
6. https://story.to.design/blog/storybook-8-support
7. https://github.com/storybookjs/storybook/releases
8. https://azukiazusa.dev/blog/storybook-testing/
9. https://storybook.js.org/releases/8.0
10. https://qiita.com/masakinihirota/items/2cf22196bbb691e2735b
11. https://developers.prtimes.jp/2023/05/02/storybook_and_tests/
12. https://storybook.js.org/docs/migration-guide/from-older-version
13. https://codezine.jp/article/detail/21706
14. https://storybook.js.org/docs/writing-tests/interaction-testing
15. https://nx.dev/technologies/test-tools/storybook/api/generators/migrate-8
16. https://storybook.js.org/blog/storybook-8-5/
17. https://qiita.com/k_kuroiwa/items/cdf9fdafb044a68eebb1
18. https://zenn.dev/rehabforjapan/articles/045a3d4c0d3bc6
19. https://zenn.dev/genda_jp/articles/14480eb1258834
20. https://tech.layerx.co.jp/entry/2025/04/21/114307
21. https://storybook.js.org/blog/storybook-8-3/
22. https://www.npmjs.com/package/@storybook/test
23. https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
24. https://zenn.dev/yumemi_inc/articles/storybook-8-3-vitest
25. https://github.com/storybookjs/test-runner
26. https://storybook.js.org/docs/8/writing-tests/test-addon
27. https://www.youtube.com/watch?v=8t5wxrFpCQY
28. https://qiita.com/keitaMax/items/66e46cdf3541bc1a703d
29. https://github.com/repobuddy/visual-testing
30. https://azukiazusa.dev/blog/storybook-and-vitest-integration
31. https://zenn.dev/makotot/articles/b0729488282148
32. https://www.npmjs.com/package/@storybook/addon-vitest
33. https://github.com/storybookjs/storybook/discussions/28386
34. https://storybook.js.org/docs/writing-tests/integrations/test-runner
35. https://zenn.dev/innovation/articles/e10e5b5842cf29
36. https://tech.mirrativ.stream/entry/2024/11/22/120000
37. https://qiita.com/kotobuki5991/items/21a5bf58602f1662d5a0
38. https://saneeeatsu.hatenablog.com/entry/2025/04/16/124656
39. https://blog.cybozu.io/entry/2024/08/13/140000
40. https://zenn.dev/yumemi_inc/articles/storybook-testing-next-navigation
41. https://ubertesters.com/blog/the-power-of-user-story-testing-amplifying-your-confidence-in-product-quality/
42. https://stackoverflow.com/questions/41296668/how-do-i-add-validation-to-the-form-in-my-react-component
43. https://stackoverflow.com/questions/70442422/how-to-mock-the-elements-of-react-hook-form-when-testing-with-react-testing-libr
44. https://testsigma.com/blog/user-stories-in-testing/
45. https://formspree.io/blog/react-form-validation/
46. https://zenn.dev/cykinso/articles/152abb5bf9cd69
47. https://roost.ai/blog/beyond-the-10x-developer-the-rise-of-the-100x-developer-and-the-role-of-the-prompt-engineer-0-0
48. https://www.freecodecamp.org/news/how-to-validate-forms-in-react/
49. https://github.com/orgs/react-hook-form/discussions/7444
50. https://www.alooba.com/skills/concepts/agile-methodologies-434/user-story-testing/
51. https://zenn.dev/hayato94087/articles/409ce06564122d
52. https://react-hook-form.com/get-started
53. https://academy.test.io/en/articles/4156595-user-story-testing
54. https://qiita.com/TK-C/items/2a440f38bf15f76254e0
55. [https://scrapbox.io/haruharu/Storybook%E3%81%A7hooks%E3%82%92%E4%BD%BF%E3%81%86](https://scrapbox.io/haruharu/Storybookでhooksを使う)
56. https://www.atlassian.com/agile/project-management/user-stories
57. [https://react-hook-form.com](https://react-hook-form.com/)
58. https://qiita.com/marl0401/items/8ceef93a850b1c6567f5
59. https://istqb-glossary.page/user-story-testing/
60. https://qiita.com/yuma_matzui/items/72570f597e1517438572
61. https://storybook.js.org/docs/configure
62. https://deep.tacoskingdom.com/blog/263
63. https://www.manuel-schoebel.com/blog/nextjs-typescript-storybook-setup
64. https://storybook.js.org/docs/addons/addon-migration-guide
65. https://qiita.com/TNRevolution/items/32f88b93d0b8f84c3f98
66. https://storybook.js.org/docs/configure/integration/typescript
67. https://github.com/storybookjs/storybook/blob/next/code/package.json
68. https://blog.ashcolor.jp/blog/programming/nuxt-storybook
69. https://qiita.com/Jochun/items/c03493aa62cb8766c5df
70. https://storybook.js.org/docs/releases/migration-guide
71. https://github.com/storybookjs/storybook/issues/30115
72. https://zenn.dev/longbridge/articles/13e65ef71455e4
73. https://zenn.dev/futsu/articles/61222d637960f3695f22
74. https://qiita.com/Hashimoto-Noriaki/items/2eb3587287ea82c141d8
75. https://zenn.dev/sa2knight/books/storybook-7-with-vue-3/viewer/setup_storybook
76. https://github.com/stoplightio/storybook-config/blob/master/package.json
77. https://qiita.com/kotobuki5991/items/dcf411789b359d99f82a
78. https://storybook.js.org/docs/configure/upgrading
79. https://zenn.dev/ayut0/articles/d7f4d233cae601