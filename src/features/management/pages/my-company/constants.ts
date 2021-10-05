import { AccessLevel, Permission, PermissionType } from '@openchannel/react-common-services';

export interface Page {
  pageId: string;
  placeholder: string;
  permissions: Permission[];
}

export const pageIds = {
  company: 'company',
  profile: 'profile',
};

export const page: Page[] = [
  {
    pageId: pageIds.company,
    placeholder: 'Company details',
    permissions: [
      {
        type: PermissionType.ORGANIZATIONS,
        access: [AccessLevel.MODIFY, AccessLevel.READ],
      },
    ],
  },
  {
    pageId: pageIds.profile,
    placeholder: 'User management',
    permissions: [
      {
        type: PermissionType.ACCOUNTS,
        access: [AccessLevel.MODIFY, AccessLevel.READ],
      },
    ],
  },
];
