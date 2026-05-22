export interface EmailAlias {
  id: string;
  workspaceId: string;
  emailAlias: string;
  assignedUserIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PhoneNumber {
  id: string;
  workspaceId: string;
  phoneNumber: string;
  sid: string;
  provider: string;
  assignedUserIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AssignEmailAliasDto {
  userIds: string[];
}

export interface AssignPhoneNumberDto {
  userIds: string[];
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
