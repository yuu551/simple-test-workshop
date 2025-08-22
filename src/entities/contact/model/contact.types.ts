/**
 * Contact Entity Types - Sample Implementation
 * 
 * 実際のAPI連携やドメインロジックがある場合の型定義例
 */

export interface ContactEntity {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  priority: ContactPriority;
  category: ContactCategory;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  tags: string[];
}

export enum ContactStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum ContactPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum ContactCategory {
  INQUIRY = 'inquiry',
  SUPPORT = 'support',
  COMPLAINT = 'complaint',
  SUGGESTION = 'suggestion',
  OTHER = 'other'
}

export interface CreateContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: ContactCategory;
  priority?: ContactPriority;
}

export interface UpdateContactPayload extends Partial<CreateContactPayload> {
  status?: ContactStatus;
  assignedTo?: string;
  tags?: string[];
}