import { find } from 'lodash';
import { UserGridActionModel } from '@openchannel/react-common-services';

import { UserData } from './types';

export const getUserByAction = (userAction: UserGridActionModel, users: UserData[]) => {
  if (users.length === 0) {
    return null;
  } else if (userAction?.inviteId) {
    return find(users, (developer) => developer?.inviteId === userAction.inviteId);
  } else {
    return find(users, (developer) => developer?.userAccountId === userAction.userAccountId);
  }
};
