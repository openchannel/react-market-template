import { UserAccountTypeModel } from '@openchannel/react-common-services';

import { ActionTypes } from './action-types';

export type JoinState = {
    userInviteData: UserAccountTypeModel | null;
};

export type Action = {
    type: ActionTypes.SET_USER_INVITES_DATA;
    payload: UserAccountTypeModel;
};