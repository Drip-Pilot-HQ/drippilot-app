export interface EmailAlias {
  id: string;
  workspaceId: string;
  emailAlias: string;
  assignedUserId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PhoneNumber {
  id: string;
  workspaceId: string;
  phoneNumber: string;
  sid: string;
  provider: string;
  assignedUserId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AssignEmailAliasDto {
  assignedUserId: string | null;
}

export interface AssignPhoneNumberDto {
  assignedUserId: string | null;
}

export interface CreateEmailAliasDto {
  emailAlias: string;
}

export interface UpdateEmailAliasDto {
  emailAlias: string;
}

export interface SearchPhoneNumbersDto {
  areaCode: string;
  limit?: number;
}

export interface BuyPhoneNumberDto {
  phoneNumber: string;
}

export interface AvailablePhoneNumber {
  phoneNumber: string;
  friendlyName: string;
  locality?: string;
  region?: string;
  isoCountry?: string;
}
