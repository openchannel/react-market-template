import { Dispatch } from 'redux';
import {
  auth,
  ChangePasswordRequest,
  nativeLogin as native,
  storage,
  UserLoginModel,
  userAccount,
} from '@openchannel/react-common-services';

import { ActionTypes } from './action-types';
import { RootState } from '../../../../types';
import { normalizeError } from '../utils';

const startLoading = () => ({ type: ActionTypes.START_LOADING });
const finishLoading = () => ({ type: ActionTypes.FINISH_LOADING });
const setUserId = (payload: string) => ({ type: ActionTypes.SET_USER_ID, payload });

export const setSession = (payload: { accessToken: string; refreshToken: string }) => {
  storage.persist(payload.accessToken, payload.refreshToken);

  return { type: ActionTypes.SET, payload };
};

export const removeSession = () => {
  storage.removeTokens();

  return { type: ActionTypes.REMOVE };
};

export const nativeLogin = (body: UserLoginModel) => async (dispatch: Dispatch) => {
  const response = await native.signIn(body);
  dispatch(setSession(response.data));

  return response.data;
};

export const loginWithSSOTokens = (idToken: string, accessToken: string) => async (dispatch: Dispatch) => {
  dispatch(startLoading());

  const { data } = await auth.login({ idToken, accessToken });

  dispatch(setSession(data));
  dispatch(finishLoading());

  return data;
};

export const tryLoginByRefreshToken = () => async (dispatch: Dispatch) => {
  try {
    const validSession = await auth.tryLoginByRefreshToken();

    if (!validSession) {
      throw 'Refresh token does not exist';
    }

    dispatch(setSession({ accessToken: storage.getAccessToken(), refreshToken: storage.getRefreshToken() }));
  } catch (error) {
    dispatch(removeSession());
    console.error(error);
    throw error;
  }
};

export const logout = () => async (dispatch: Dispatch, getState: () => RootState) => {
  const {
    oidc: { isSsoLogin, userManager },
  } = getState();

  await auth.logOut();
  dispatch(removeSession());

  if (isSsoLogin) {
    if (!userManager) return;

    await userManager.signoutRedirect();
  }
};

export const changePassword = (body: ChangePasswordRequest) => async (dispatch: Dispatch) => {
  try {
    const response = await native.changePassword({ ...body, jwtRefreshToken: storage.getRefreshToken() });
    const { accessToken, refreshToken } = response.data;
    dispatch(setSession({ accessToken, refreshToken }));
  } catch (error) {
    // throw normalizeError(error);
  }
};

export const fetchUserId = () => async (dispatch: Dispatch) => {
  dispatch(startLoading());
  try {
    const { data } = await userAccount.getUserAccount();
    console.log('data', data);

    dispatch(setUserId(data.userId));
    dispatch(finishLoading());
  } catch (error) {
    dispatch(finishLoading());
    throw error;
  }
};
