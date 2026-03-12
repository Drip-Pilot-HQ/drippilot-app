export type LeadStatusValue = 'hot' | 'warm' | 'cold' | 'converted' | 'unsubscribed';

export interface AppNotification {
  id: string;
  userId: string;
  workspaceId: string;
  leadId: string | null;
  outreachId: string | null;
  leadName: string;
  leadStatus: LeadStatusValue;
  workspaceName: string;
  messageUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResult {
  data: AppNotification[];
  total: number;
  page: number;
  pageSize: number;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  workspaceId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  notifyEmail: string | null;
  notifyOnStatuses: LeadStatusValue[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNotificationPreferencesDto {
  emailEnabled: boolean;
  pushEnabled: boolean;
  notifyEmail?: string | null;
  notifyOnStatuses: LeadStatusValue[];
}

export interface RegisterPushSubscriptionDto {
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string;
}
