import { LeadStatus } from './lead';

export interface SourceRuleCondition {
  tags?: string[];
  leadStatus?: LeadStatus;
  matchMode?: 'AND' | 'OR';
}

export interface SourceRuleAction {
  campaignIds: string[];
}

export interface SourceRule {
  condition: SourceRuleCondition;
  action: SourceRuleAction;
}

export interface LeadSource {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  isActive: boolean;
  rules: SourceRule[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadSourceDto {
  name: string;
  rules?: SourceRule[];
}

export interface UpdateLeadSourceDto {
  name?: string;
  rules?: SourceRule[];
  isActive?: boolean;
}

export interface LeadSourceCreatedResponse extends LeadSource {
  secret: string;
}

export interface RegenerateSecretResponse {
  secret: string;
}
