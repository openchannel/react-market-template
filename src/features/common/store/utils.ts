import { InviteUserModel, UserAccount } from '@openchannel/react-common-services';

interface ValidationError {
  field: string;
  message: string;
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
      'validation-errors'?: ValidationError[];
    };
  };
}

interface NormalizedError {
  message: string;
  errors?: Record<string, [string]>;
}

export const normalizeError = (error: ErrorResponse): NormalizedError => {
  const message = error.response?.data?.message || 'Unknown error';
  const validationErrors = error.response?.data?.['validation-errors'];
  if (validationErrors != null && validationErrors?.length > 0) {
    const errors = validationErrors.reduce((acc, error: ValidationError) => {
      acc[error.field] = [error.message];
      return acc;
    }, {} as Record<string, [string]>);

    return { message, errors };
  }

  return { message };
};
type UserRoles = Record<string, string>;

export const mapToGridUserFromInvite = (
  user: InviteUserModel,
  listRoles: UserRoles,
): {
  subject?: string;
  created: number | undefined;
  inviteId: string | undefined;
  inviteStatus: string;
  roles: string[];
  customData: string;
  body?: string;
  type?: string;
  lastSent?: number;
  userId: string | undefined;
  token?: string;
  inviteToken: string | undefined;
  userInviteId?: string;
  createdDate?: number;
  permissions?: string[];
  userAccountId: string | undefined;
  userInviteTemplateId?: string;
  name: string | undefined;
  expireDate?: number;
  expireSeconds?: number;
  email: string | undefined;
} => {
  return {
    ...user,
    name: user.name,
    email: user.email,
    customData: user.customData,
    userId: user.userId,
    userAccountId: user.userAccountId,
    created: user.createdDate,
    inviteId: user.userInviteId,
    inviteToken: user.token,
    inviteStatus: 'INVITED',
    roles: toRoleName(listRoles, user.roles),
  };
};

export const toRoleName = (listRoles: UserRoles, userRoles?: string[]): string[] => {
  return userRoles?.map((r) => listRoles[r]) || [];
};

export const mapToGridUserFromUser = (
  user: UserAccount,
  listRoles: UserRoles,
): {
  created: number;
  permissions?: string[];
  inviteStatus: string;
  userAccountId: string;
  roles: string[];
  name: string;
  customData: string;
  type?: string;
  userId: string;
  email: string;
} => {
  return {
    ...user,
    name: user.name,
    email: user.email,
    customData: user.customData,
    userId: user.userId,
    userAccountId: user.userAccountId,
    created: user.created,
    inviteStatus: 'ACTIVE',
    roles: toRoleName(listRoles, user.roles),
  };
};
