import { describe, it, expect } from 'vitest';
import {
  contactFormTestData,
  getTestDataByScenarioId,
  getTestDataByScenarioIds,
  getTestDataByUserStoryId,
  validateTestData,
  type TestDataSet
} from './testData';

describe('Test Data Utilities', () => {
  describe('getTestDataByScenarioId', () => {
    it('存在するシナリオIDでテストデータを取得できる', () => {
      const result = getTestDataByScenarioId('SC-001-1');
      expect(result).toBeDefined();
      expect(result!.scenarioId).toBe('SC-001-1');
      expect(result!.description).toBe('正常な問い合わせ送信');
      expect(result!.data.name).toBe('田中太郎');
      expect(result!.data.email).toBe('tanaka@example.com');
      expect(result!.expectedResult).toBe('success');
    });

    it('存在しないシナリオIDでundefinedを返す', () => {
      const result = getTestDataByScenarioId('SC-999-1');
      expect(result).toBeUndefined();
    });

    it('全ての定義済みシナリオが取得できる', () => {
      const scenarioIds = ['SC-001-1', 'SC-001-2', 'SC-001-3', 'SC-002-1', 'SC-002-2', 'SC-003-1'];
      
      scenarioIds.forEach(scenarioId => {
        const result = getTestDataByScenarioId(scenarioId);
        expect(result).toBeDefined();
        expect(result!.scenarioId).toBe(scenarioId);
      });
    });
  });

  describe('getTestDataByScenarioIds', () => {
    it('複数の存在するシナリオIDでテストデータを取得できる', () => {
      const scenarioIds = ['SC-001-1', 'SC-001-2'];
      const result = getTestDataByScenarioIds(scenarioIds);
      
      expect(result).toHaveLength(2);
      expect(result[0].scenarioId).toBe('SC-001-1');
      expect(result[1].scenarioId).toBe('SC-001-2');
    });

    it('一部存在しないシナリオIDが含まれている場合は存在するもののみ返す', () => {
      const scenarioIds = ['SC-001-1', 'SC-999-1', 'SC-001-2'];
      const result = getTestDataByScenarioIds(scenarioIds);
      
      expect(result).toHaveLength(2);
      expect(result[0].scenarioId).toBe('SC-001-1');
      expect(result[1].scenarioId).toBe('SC-001-2');
    });

    it('全て存在しないシナリオIDの場合は空配列を返す', () => {
      const scenarioIds = ['SC-999-1', 'SC-999-2'];
      const result = getTestDataByScenarioIds(scenarioIds);
      
      expect(result).toHaveLength(0);
    });

    it('空配列を渡した場合は空配列を返す', () => {
      const result = getTestDataByScenarioIds([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('getTestDataByUserStoryId', () => {
    it('US-001に対応するシナリオを全て取得できる', () => {
      const result = getTestDataByUserStoryId('US-001');
      
      expect(result).toHaveLength(3);
      expect(result.map(r => r.scenarioId)).toEqual(['SC-001-1', 'SC-001-2', 'SC-001-3']);
    });

    it('US-002に対応するシナリオを全て取得できる', () => {
      const result = getTestDataByUserStoryId('US-002');
      
      expect(result).toHaveLength(2);
      expect(result.map(r => r.scenarioId)).toEqual(['SC-002-1', 'SC-002-2']);
    });

    it('US-003に対応するシナリオを取得できる', () => {
      const result = getTestDataByUserStoryId('US-003');
      
      expect(result).toHaveLength(1);
      expect(result[0].scenarioId).toBe('SC-003-1');
    });

    it('存在しないユーザーストーリーIDで空配列を返す', () => {
      const result = getTestDataByUserStoryId('US-999');
      expect(result).toHaveLength(0);
    });
  });

  describe('validateTestData', () => {
    it('有効なテストデータでエラーなしを返す', () => {
      const validData = {
        name: '田中太郎',
        email: 'tanaka@example.com',
        subject: 'テスト件名',
        message: 'これは10文字以上のテストメッセージです。',
        privacyPolicy: true
      };

      const result = validateTestData(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('名前が空の場合にエラーを返す', () => {
      const invalidData = {
        name: '',
        email: 'tanaka@example.com',
        subject: 'テスト件名',
        message: 'これは10文字以上のテストメッセージです。',
        privacyPolicy: true
      };

      const result = validateTestData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('名前は必須項目です');
    });

    it('メールアドレスが無効な形式の場合にエラーを返す', () => {
      const invalidData = {
        name: '田中太郎',
        email: 'invalid-email',
        subject: 'テスト件名',
        message: 'これは10文字以上のテストメッセージです。',
        privacyPolicy: true
      };

      const result = validateTestData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('正しいメールアドレスを入力してください');
    });

    it('件名が空の場合にエラーを返す', () => {
      const invalidData = {
        name: '田中太郎',
        email: 'tanaka@example.com',
        subject: '',
        message: 'これは10文字以上のテストメッセージです。',
        privacyPolicy: true
      };

      const result = validateTestData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('件名は必須項目です');
    });

    it('メッセージが空の場合にエラーを返す', () => {
      const invalidData = {
        name: '田中太郎',
        email: 'tanaka@example.com',
        subject: 'テスト件名',
        message: '',
        privacyPolicy: true
      };

      const result = validateTestData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('本文は必須項目です');
    });

    it('複数のエラーがある場合に全てのエラーを返す', () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        subject: '',
        message: '',
        privacyPolicy: true
      };

      const result = validateTestData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(4);
      expect(result.errors).toContain('名前は必須項目です');
      expect(result.errors).toContain('正しいメールアドレスを入力してください');
      expect(result.errors).toContain('件名は必須項目です');
      expect(result.errors).toContain('本文は必須項目です');
    });
  });

  describe('contactFormTestData 整合性テスト', () => {
    it('全てのテストデータが必要なプロパティを持っている', () => {
      contactFormTestData.forEach(testData => {
        expect(testData).toHaveProperty('scenarioId');
        expect(testData).toHaveProperty('description');
        expect(testData).toHaveProperty('data');
        expect(testData).toHaveProperty('expectedResult');

        // データオブジェクトの検証
        expect(testData.data).toHaveProperty('name');
        expect(testData.data).toHaveProperty('email');
        expect(testData.data).toHaveProperty('subject');
        expect(testData.data).toHaveProperty('message');
        expect(testData.data).toHaveProperty('privacyPolicy');

        // expectedResultの値の検証
        expect(['success', 'validation_error', 'submission_error']).toContain(testData.expectedResult);
      });
    });

    it('シナリオIDが一意である', () => {
      const scenarioIds = contactFormTestData.map(data => data.scenarioId);
      const uniqueScenarioIds = [...new Set(scenarioIds)];
      
      expect(scenarioIds.length).toBe(uniqueScenarioIds.length);
    });

    it('説明文が設定されている', () => {
      contactFormTestData.forEach(testData => {
        expect(testData.description).toBeTruthy();
        expect(typeof testData.description).toBe('string');
        expect(testData.description.length).toBeGreaterThan(0);
      });
    });

    it('エラーが期待されるテストデータにはexpectedErrorsが設定されている', () => {
      const errorExpectedData = contactFormTestData.filter(data => 
        data.expectedResult === 'validation_error'
      );

      errorExpectedData.forEach(testData => {
        expect(testData).toHaveProperty('expectedErrors');
        expect(Array.isArray(testData.expectedErrors)).toBe(true);
        expect(testData.expectedErrors!.length).toBeGreaterThan(0);
      });
    });
  });

  describe('エッジケース', () => {
    it('空文字のシナリオIDで検索しても安全に処理される', () => {
      const result = getTestDataByScenarioId('');
      expect(result).toBeUndefined();
    });

    it('nullやundefinedをシナリオID配列に含めても安全に処理される', () => {
      const result = getTestDataByScenarioIds(['SC-001-1', null as any, undefined as any, 'SC-001-2']);
      expect(result).toHaveLength(2);
    });

    it('境界値テスト - メッセージの文字数チェック', () => {
      // 実際のテストデータで最小文字数制限をテスト
      const testDataWithShortMessage = contactFormTestData.find(data => 
        data.scenarioId === 'SC-001-2' || data.scenarioId === 'SC-001-3'
      );
      
      if (testDataWithShortMessage) {
        expect(testDataWithShortMessage.data.message.length).toBeGreaterThanOrEqual(10);
      }
    });
  });
});