/**
 * Contact Entity - Sample Business Logic Implementation
 * 
 * 実際のAPI連携やドメインロジックがある場合の実装例
 * このファイルは現在のプロジェクトでは使用されていません。
 */

import { ContactEntity, ContactStatus, ContactPriority, ContactCategory, CreateContactPayload } from './contact.types';

export class Contact implements ContactEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public subject: string,
    public message: string,
    public status: ContactStatus = ContactStatus.DRAFT,
    public priority: ContactPriority = ContactPriority.NORMAL,
    public category: ContactCategory = ContactCategory.INQUIRY,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public assignedTo?: string,
    public tags: string[] = []
  ) {}

  /**
   * Contact作成用のファクトリーメソッド
   */
  static create(payload: CreateContactPayload): Contact {
    return new Contact(
      crypto.randomUUID(),
      payload.name,
      payload.email,
      payload.subject,
      payload.message,
      ContactStatus.DRAFT,
      payload.priority || ContactPriority.NORMAL,
      payload.category || ContactCategory.INQUIRY
    );
  }

  /**
   * ビジネスロジック: 緊急度の自動判定
   */
  calculateAutoPriority(): ContactPriority {
    const urgentKeywords = ['緊急', '至急', '障害', 'バグ', 'エラー'];
    const highKeywords = ['重要', '問題', 'トラブル'];
    
    const text = `${this.subject} ${this.message}`.toLowerCase();
    
    if (urgentKeywords.some(keyword => text.includes(keyword))) {
      return ContactPriority.URGENT;
    }
    
    if (highKeywords.some(keyword => text.includes(keyword))) {
      return ContactPriority.HIGH;
    }
    
    return ContactPriority.NORMAL;
  }

  /**
   * ビジネスロジック: カテゴリの自動判定
   */
  calculateAutoCategory(): ContactCategory {
    const supportKeywords = ['使い方', 'ヘルプ', 'サポート', '操作方法'];
    const complaintKeywords = ['苦情', '不満', '問題', 'クレーム'];
    const suggestionKeywords = ['提案', '改善', '要望', 'リクエスト'];
    
    const text = `${this.subject} ${this.message}`.toLowerCase();
    
    if (supportKeywords.some(keyword => text.includes(keyword))) {
      return ContactCategory.SUPPORT;
    }
    
    if (complaintKeywords.some(keyword => text.includes(keyword))) {
      return ContactCategory.COMPLAINT;
    }
    
    if (suggestionKeywords.some(keyword => text.includes(keyword))) {
      return ContactCategory.SUGGESTION;
    }
    
    return ContactCategory.INQUIRY;
  }

  /**
   * ビジネスロジック: 自動分類の実行
   */
  applyAutoClassification(): void {
    this.priority = this.calculateAutoPriority();
    this.category = this.calculateAutoCategory();
    this.updatedAt = new Date();
  }

  /**
   * ビジネスロジック: ステータス変更のバリデーション
   */
  canChangeStatusTo(newStatus: ContactStatus): boolean {
    const statusTransitions: Record<ContactStatus, ContactStatus[]> = {
      [ContactStatus.DRAFT]: [ContactStatus.SUBMITTED],
      [ContactStatus.SUBMITTED]: [ContactStatus.IN_PROGRESS, ContactStatus.CLOSED],
      [ContactStatus.IN_PROGRESS]: [ContactStatus.RESOLVED, ContactStatus.CLOSED],
      [ContactStatus.RESOLVED]: [ContactStatus.CLOSED, ContactStatus.IN_PROGRESS],
      [ContactStatus.CLOSED]: []
    };

    return statusTransitions[this.status].includes(newStatus);
  }

  /**
   * ビジネスロジック: ステータス変更
   */
  changeStatus(newStatus: ContactStatus): boolean {
    if (!this.canChangeStatusTo(newStatus)) {
      return false;
    }

    this.status = newStatus;
    this.updatedAt = new Date();
    return true;
  }

  /**
   * ビジネスロジック: 担当者アサイン
   */
  assignTo(userId: string): void {
    this.assignedTo = userId;
    if (this.status === ContactStatus.SUBMITTED) {
      this.status = ContactStatus.IN_PROGRESS;
    }
    this.updatedAt = new Date();
  }

  /**
   * ビジネスロジック: タグの追加
   */
  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date();
    }
  }

  /**
   * ビジネスロジック: SLA違反チェック（Service Level Agreement）
   */
  isSLAViolated(): boolean {
    const now = new Date();
    const hoursSinceCreation = (now.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60);
    
    const slaHours: Record<ContactPriority, number> = {
      [ContactPriority.URGENT]: 2,
      [ContactPriority.HIGH]: 8,
      [ContactPriority.NORMAL]: 24,
      [ContactPriority.LOW]: 72
    };

    return hoursSinceCreation > slaHours[this.priority] && 
           this.status !== ContactStatus.RESOLVED && 
           this.status !== ContactStatus.CLOSED;
  }

  /**
   * エンティティの文字列表現
   */
  toString(): string {
    return `Contact(${this.id}): ${this.subject} [${this.status}]`;
  }
}