import { ActionTypes } from './action-types';

export type SortQuery = { sortBy: string; sortOrder: number };

export type UserInvites = {
  listRoles: any;
  sortQuery: SortQuery;
  userProperties: any;
};

export type Action =
  | {
      type: ActionTypes.SET_LIST_ROLES;
      payload: any;
    }
  | {
      type: ActionTypes.SET_SORT_QUERY;
      payload: SortQuery;
    }
  | {
      type: ActionTypes.SET_USER_PROPERTIES;
      payload: {
        userProperties: any;
      };
    };
