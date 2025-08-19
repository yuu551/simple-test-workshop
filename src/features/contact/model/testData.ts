/**
 * テストデータ管理システム
 * ユーザーストーリーのシナリオIDとテストデータを連携
 */

import { type ContactFormData } from './validation';

export interface TestDataSet {
  scenarioId: string;
  description: string;
  data: ContactFormData;
  expectedResult?: 'success' | 'validation_error' | 'submission_error';
  expectedErrors?: string[];
}

/**
 * シナリオごとのテストデータ定義
 */
export const contactFormTestData: TestDataSet[] = [
  // US-001 シナリオ: 正常な問い合わせ送信
  {
    scenarioId: 'SC-001-1',
    description: '正常な問い合わせ送信',
    data: {
      name: '田中太郎',
      email: 'tanaka@example.com',
      subject: 'サービスについて',
      message: '詳細を教えてください',
      privacyPolicy: true
    },
    expectedResult: 'success'
  },
  
  // US-001 シナリオ: 必須項目未入力エラー
  {
    scenarioId: 'SC-001-2',
    description: '必須項目未入力でのエラー',
    data: {
      name: '',
      email: 'tanaka@example.com',
      subject: 'テスト',
      message: 'テストメッセージです。十文字以上で入力しています。',
      privacyPolicy: true
    },
    expectedResult: 'validation_error',
    expectedErrors: ['名前は必須項目です']
  },
  
  // US-001 シナリオ: 不正なメールアドレス形式
  {
    scenarioId: 'SC-001-3',
    description: '不正なメールアドレス形式',
    data: {
      name: '田中太郎',
      email: 'invalid-email',
      subject: 'テスト',
      message: 'テストメッセージです。十文字以上で入力しています。',
      privacyPolicy: true
    },
    expectedResult: 'validation_error',
    expectedErrors: ['正しいメールアドレスを入力してください']
  },
  
  // US-002 シナリオ: 確認後の送信
  {
    scenarioId: 'SC-002-1',
    description: '確認後の送信',
    data: {
      name: '佐藤花子',
      email: 'sato@example.com',
      subject: '製品について',
      message: '価格を教えてください',
      privacyPolicy: true
    },
    expectedResult: 'success'
  },
  
  // US-002 シナリオ: 確認画面から編集に戻る
  {
    scenarioId: 'SC-002-2',
    description: '確認画面から編集に戻る',
    data: {
      name: '鈴木次郎',
      email: 'suzuki@example.com',
      subject: 'サポートについて',
      message: 'ヘルプが必要です',
      privacyPolicy: true
    },
    expectedResult: 'success'
  },
  
  // US-003 シナリオ: 入力内容の自動保存と復元
  {
    scenarioId: 'SC-003-1',
    description: '入力内容の自動保存と復元',
    data: {
      name: '田中太郎',
      email: 'tanaka.restore@example.com',
      subject: '自動保存テスト',
      message: '内容が復元されるかテスト',
      privacyPolicy: true
    },
    expectedResult: 'success'
  }
];

/**
 * シナリオIDからテストデータを取得する関数
 * @param scenarioId シナリオID (例: "SC-001-1")
 * @returns 対応するテストデータセット
 */
export const getTestDataByScenarioId = (scenarioId: string): TestDataSet | undefined => {
  return contactFormTestData.find(testData => testData.scenarioId === scenarioId);
};

/**
 * 複数のシナリオIDからテストデータを取得する関数
 * @param scenarioIds シナリオIDの配列
 * @returns 対応するテストデータセットの配列
 */
export const getTestDataByScenarioIds = (scenarioIds: string[]): TestDataSet[] => {
  return scenarioIds
    .map(id => getTestDataByScenarioId(id))
    .filter((data): data is TestDataSet => data !== undefined);
};

/**
 * ユーザーストーリーIDからテストデータを取得する関数
 * @param userStoryId ユーザーストーリーID (例: "US-001")
 * @returns 対応するテストデータセットの配列
 */
export const getTestDataByUserStoryId = (userStoryId: string): TestDataSet[] => {
  const prefix = userStoryId.replace('US-', 'SC-') + '-';
  return contactFormTestData.filter(testData => 
    testData.scenarioId.startsWith(prefix)
  );
};

/**
 * テストデータの妥当性チェック
 * @param data テストデータ
 * @returns バリデーション結果
 */
export const validateTestData = (data: ContactFormData): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (!data.name.trim()) {
    errors.push('名前は必須項目です');
  }
  
  if (!data.email.trim()) {
    errors.push('メールアドレスは必須項目です');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('正しいメールアドレスを入力してください');
  }
  
  if (!data.subject.trim()) {
    errors.push('件名は必須項目です');
  }
  
  if (!data.message.trim()) {
    errors.push('本文は必須項目です');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};