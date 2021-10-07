import { find } from 'lodash';
import { UserGridActionModel } from '@openchannel/react-common-services';

import { IndexedUserAccountGridModel } from './types';

export const getUserByAction = (userAction: UserGridActionModel, users: IndexedUserAccountGridModel[]) => {
  if (users.length === 0) {
    return null;
  } else if (userAction?.inviteId) {
    return find(users, (developer) => developer?.inviteId === userAction.inviteId);
  } else {
    return find(users, (developer) => developer?.userAccountId === userAction.userAccountId);
  }
};
