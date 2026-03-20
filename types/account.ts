
export enum WorkspaceRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum WorkspaceStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

export interface Workspace {
  id: string;
  name: string;
  role: WorkspaceRole;
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  userId: string | null;
  inviteEmail: string | null;
  role: WorkspaceRole;
  status: WorkspaceStatus;
  createdAt: string;
  workspace: {
    id: string;
    name: string;
  };
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string | null;
  role: WorkspaceRole;
  status: WorkspaceStatus;
  inviteEmail: string | null;
  memberName: string | null;
  joinedAt: string | null;
  createdAt: string;
}

export interface CreateWorkspaceDto {
  name: string;
}

export interface UpdateWorkspaceDto {
  name: string;
}

export interface AddMemberDto {
  email: string;
  role: WorkspaceRole;
}

export interface UpdateMemberRoleDto {
  role: WorkspaceRole;
}

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface ApiKeyCreatedResponse extends ApiKey {
  rawKey: string;
  _warning: string;
}

export interface CreateApiKeyDto {
  name: string;
  expiresAt?: string;
}

// Referral Types
export interface ReferralCode {
  code: string;
  createdAt: string;
}

export interface ReferralSignup {
  referredUserId: string;
  referredEmail: string;
  referredName: string;
  createdAt: string;
}

export type CommissionStatus = 'pending' | 'paid';

export interface ReferralCommission {
  id: string;
  referralSignupId: string;
  workspaceId: string;
  stripeInvoiceId: string;
  invoiceAmountCents: number;
  commissionAmountCents: number;
  commissionRate: number;
  status: CommissionStatus;
  paidAt: string | null;
  createdAt: string;
}

export interface CommissionSummary {
  pendingCents: number;
  paidCents: number;
}
