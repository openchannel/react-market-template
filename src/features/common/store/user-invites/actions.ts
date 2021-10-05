import { ActionTypes } from './action-types';
import {
  InviteUserModel,
  Page,
  UserAccount,
  userAccount,
  userInvites,
  userRole,
  UserRoleResponse,
  UsersGridParametersModel,
} from '@openchannel/react-common-services';
import { Dispatch } from 'redux';
import { RootState } from '../../../../types';
import { mapToGridUserFromInvite, mapToGridUserFromUser } from '../utils';
import { SortQuery } from './types';

export const saveRoles = (payload: Record<string, string>) => {
  return { type: ActionTypes.SET_LIST_ROLES, payload };
};
export const saveUserProperties = (payload: UsersGridParametersModel) => {
  return { type: ActionTypes.SET_USER_PROPERTIES, payload };
};
export const saveUserSortQuery = (payload: SortQuery) => {
  return { type: ActionTypes.SET_SORT_QUERY, payload };
};

const getSortQuery = (sortBy: string, prevSortQuery: SortQuery): SortQuery => {
  return prevSortQuery.sortBy === sortBy
    ? { sortBy, sortOrder: prevSortQuery.sortOrder * -1 }
    : { sortBy, sortOrder: 1 };
};

export const getRoles = (roles: Page<UserRoleResponse>): Record<string, string> => {
  return roles.list.reduce((acc, val) => {
    acc[val.userRoleId] = val.name;
    return acc;
  }, {} as Record<string, string>);
};

export const getAllUsers =
  (pageNumber: number, sortQuery: SortQuery) => async (dispatch: Dispatch, getState: () => RootState) => {
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
    const sortQueryStr = JSON.stringify({ [sortQuery.sortBy]: sortQuery.sortOrder });
    const fetchData = await Promise.allSettled([
      userInvites.getUserInvites(pageNumber, 10, sortQueryStr),
      userAccount.getUserAccounts(pageNumber, 10, sortQueryStr),
      userRole.getUserRoles(1, 100),
    ]);

    const [invites, accounts, roles] = fetchData;

    let nextInvites: InviteUserModel[] = [];
    let nextAccount: UserAccount[] = [];

    if (invites.status === 'fulfilled' && accounts.status === 'fulfilled' && roles.status === 'fulfilled') {
      const userRoles = getRoles(roles.value.data);
      nextInvites = invites.value.data.list.map((user: InviteUserModel) => mapToGridUserFromInvite(user, userRoles));

      if (pageNumber > 1) {
        const lastInvitedDev = oldInvites.filter((user) => user.inviteStatus === 'INVITED').pop();

        if (lastInvitedDev) {
          oldInvites.splice(oldInvites.lastIndexOf(lastInvitedDev) + 1, 0, ...nextInvites);

          nextInvites = oldInvites;
        }
      }

      nextAccount = accounts.value.data.list.map((user: UserAccount) => mapToGridUserFromUser(user, userRoles));

      newProperties.data.pages = invites.value.data.pages;
      newProperties.data.pageNumber = invites.value.data.pageNumber;
    }

    newProperties.data.list = [...nextInvites, ...nextAccount];
    dispatch(saveUserProperties(newProperties));
  };

export const sortMyCompany = (sortBy: string) => async (dispatch: Dispatch, getState: () => RootState) => {
  const {
    userInvites: { userProperties, sortQuery },
  } = getState();

  const nextSortQuery = getSortQuery(sortBy, sortQuery);
  dispatch(saveUserSortQuery(nextSortQuery));
  const nextSortQueryStr = JSON.stringify({ [nextSortQuery.sortBy]: nextSortQuery.sortOrder });

  const fetchDataSort = await Promise.allSettled([
    userInvites.getUserInvites(1, 10, nextSortQueryStr),
    userAccount.getUserAccounts(1, 10, nextSortQueryStr),
    userRole.getUserRoles(1, 100),
  ]);

  const [invites, accounts, roles] = fetchDataSort;

  let nextInvites: InviteUserModel[] = [];
  let nextAccount: UserAccount[] = [];
  let userRoles: Record<string, string>;

  if (roles.status === 'fulfilled') {
    userRoles = getRoles(roles.value.data);
  }

  if (invites.status === 'fulfilled') {
    nextInvites = invites.value.data.list.map((user) => mapToGridUserFromInvite(user, userRoles));
  }

  if (accounts.status === 'fulfilled') {
    nextAccount = accounts.value.data.list.map((user) => mapToGridUserFromUser(user, userRoles));
  }
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
};
