import { AccessLevel, PermissionType } from '@openchannel/react-common-services';

import { Page } from './types';

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
