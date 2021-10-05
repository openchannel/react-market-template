import { ActionTypes } from './action-types';
import {
  InviteUserModel,
  UserAccount,
  userAccount,
  userInvites,
  userRole,
  UsersGridParametersModel,
} from '@openchannel/react-common-services';
import { Dispatch } from 'redux';
import { RootState } from '../../../../types';

export const saveRoles = (payload: Record<string, string>) => {
  return { type: ActionTypes.SET_LIST_ROLES, payload };
};
export const saveUserProperties = (payload: UsersGridParametersModel) => {
  return { type: ActionTypes.SET_USER_PROPERTIES, payload };
};
export const saveUserSortQuery = (payload: string) => {
  return { type: ActionTypes.SET_SORT_QUERY, payload };
};

const mapToGridUserFromInvite = (
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

type UserRoles = Record<string, string>;

const toRoleName = (listRoles: UserRoles, userRoles?: string[]): string[] => {
  return userRoles?.map((r) => listRoles[r]) || [];
};

const mapToGridUserFromUser = (
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

const getSortQuery = (sortBy: string, prevSortQuery: string) => {
  switch (sortBy) {
    case 'name':
      return prevSortQuery === '{"name": 1}' ? '{"name": -1}' : '{"name": 1}';
    case 'email':
      return prevSortQuery === '{"email": 1}' ? '{"email": -1}' : '{"email": 1}';
    case 'date':
      return prevSortQuery === '{"created": 1}' ? '{"created": -1}' : '{"created": 1}';
    case 'role':
      return prevSortQuery === '{"type": 1}' ? '{"type": -1}' : '{"type": 1}';
    default:
      return prevSortQuery;
  }
};

export const getRoles = async (startNewPagination: boolean, oldRoles: UserRoles) => {
  const response = await userRole.getUserRoles(1, 100);
  if (response) {
    const tempRoles: UserRoles = {};
    response.data.list.forEach((r) => (tempRoles[r.userRoleId] = r.name));
    return tempRoles;
  }

  return oldRoles;
};

export const getAllUsers =
  (pageNumber: number, sortQuery: string, startNewPagination: boolean) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const {
      userInvites: { userProperties },
    } = getState();

    const newProperties = {
      ...userProperties,
      data: {
        ...userProperties.data,
      },
    };

    const oldInvites = [...userProperties.data.list];

    const fetchData = await Promise.allSettled([
      userInvites.getUserInvites(pageNumber, 10, sortQuery),
      userAccount.getUserAccounts(pageNumber, 10, sortQuery),
    ]);

    const [invites, accounts] = fetchData;

    let nextInvites: InviteUserModel[] = [];
    let nextAccount: UserAccount[] = [];

    if (invites.status === 'fulfilled' && accounts.status === 'fulfilled') {
      const newRoles = await getRoles(startNewPagination, {});
      dispatch(saveRoles(newRoles));

      nextInvites = invites.value.data.list.map((user: InviteUserModel) => mapToGridUserFromInvite(user, newRoles));

      if (pageNumber > 1) {
        const lastInvitedDev = oldInvites.filter((user) => user.inviteStatus === 'INVITED').pop();

        if (lastInvitedDev) {
          oldInvites.splice(oldInvites.lastIndexOf(lastInvitedDev) + 1, 0, ...nextInvites);

          nextInvites = oldInvites;
        }
      }

      nextAccount = accounts.value.data.list.map((user: UserAccount) => mapToGridUserFromUser(user, newRoles));

      newProperties.data.list = [...nextInvites, ...nextAccount];
      newProperties.data.pages = invites.value.data.pages;
      newProperties.data.pageNumber = invites.value.data.pageNumber;

      dispatch(saveUserProperties(newProperties));
    } else if (invites.status === 'rejected' && accounts.status === 'rejected') {
      newProperties.data.list = [...nextInvites, ...nextAccount];

      dispatch(saveUserProperties(newProperties));
    }
  };

export const sortMyCompany = (sortBy: string) => async (dispatch: Dispatch, getState: () => RootState) => {
  const {
    userInvites: { userProperties, sortQuery },
  } = getState();

  const nextSortQuery = getSortQuery(sortBy, sortQuery);

  dispatch(saveUserSortQuery(nextSortQuery));

  const fetchDataSort = await Promise.allSettled([
    userInvites.getUserInvites(1, 10, nextSortQuery),
    userAccount.getUserAccounts(1, 10, nextSortQuery),
  ]);

  const [invites, accounts] = fetchDataSort;

  let nextInvites: InviteUserModel[] = [];
  let nextAccount: UserAccount[] = [];

  if (invites.status === 'fulfilled' && accounts.status === 'fulfilled') {
    const newRoles = await getRoles(true, {});
    dispatch(saveRoles(newRoles));

    nextInvites = invites.value.data.list.map((user) => mapToGridUserFromInvite(user, newRoles));
    nextAccount = accounts.value.data.list.map((user) => mapToGridUserFromUser(user, newRoles));

    dispatch(
      saveUserProperties({
        ...userProperties,
        data: {
          ...userProperties.data,
          list: [...nextInvites, ...nextAccount],
          pageNumber: 1,
        },
      }),
    );
  } else if (invites.status === 'rejected' && accounts.status === 'rejected') {
    dispatch(
      saveUserProperties({
        ...userProperties,
        data: {
          ...userProperties.data,
          list: [...nextInvites, ...nextAccount],
          pageNumber: 1,
        },
      }),
    );
  }
};
