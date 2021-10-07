import { InviteUserModel, Page, UserAccount, UserRoleResponse } from '@openchannel/react-common-services';

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

export type UserRoles = Record<string, string>;

interface GridInviteUser extends InviteUserModel {
  created?: number;
  inviteId?: string;
  inviteToken?: string;
  inviteStatus: string;
}

interface GridUserAccount extends UserAccount {
  inviteStatus: string;
}

export const mapToGridUserFromInvite = (user: InviteUserModel, listRoles: UserRoles): GridInviteUser => {
  return {
    ...user,
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

export const mapToGridUserFromUser = (user: UserAccount, listRoles: UserRoles): GridUserAccount => {
  return {
    ...user,
    inviteStatus: 'ACTIVE',
    roles: toRoleName(listRoles, user.roles),
  };
};

export const mapRoles = (roles: Page<UserRoleResponse>): UserRoles => {
  return roles.list.reduce((acc, val) => {
    acc[val.userRoleId] = val.name;
    return acc;
  }, {} as UserRoles);
};

// export const getAccountId = (userData: UserData): string => {
//   if (userData?.userAccountId) {
//     return (userData.userAccountId as string);
//   } else if (userData?.developerAccountId) {
//     return (userData.developerAccountId as string);
//   }
//   return '';
// }
