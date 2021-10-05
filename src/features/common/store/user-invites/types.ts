import { ActionTypes } from './action-types';

export type UserInvites = {
  listRoles: any;
  sortQuery: string;
  userProperties: any;
};

export type Action =
  | {
      type: ActionTypes.SET_LIST_ROLES;
      payload: any;
    }
  | {
      type: ActionTypes.SET_SORT_QUERY;
      payload: string;
    }
  | {
      type: ActionTypes.SET_USER_PROPERTIES;
      payload: {
        userProperties: any;
      };
    };
