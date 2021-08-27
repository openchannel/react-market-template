import { Dispatch } from 'redux';
import { auth, nativeLogin as native, storage, UserLoginModel } from '@openchannel/react-common-services';

import { ActionTypes } from './action-types';

const startLoading = () => ({ type: ActionTypes.START_LOADING });
const finishLoading = () => ({ type: ActionTypes.FINISH_LOADING });

const setSession = (payload: { accessToken: string; refreshToken: string }) => {
  storage.persist(payload.accessToken, payload.refreshToken);

  return { type: ActionTypes.SET, payload };
};

const removeSession = () => {
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
  dispatch(startLoading());

  try {
    const validSession = await auth.tryLoginByRefreshToken();

    if (!validSession) {
      throw 'Refresh token does not exist';
    }

    dispatch(setSession({ accessToken: storage.getAccessToken(), refreshToken: storage.getRefreshToken() }));
    dispatch(finishLoading());
  } catch (e) {
    dispatch(removeSession());
    dispatch(finishLoading());
    console.error('Refresh token error.', e);

    throw e;
  }
};

export const logout = () => async (dispatch: Dispatch) => {
  dispatch(startLoading());
  try {
    const logoutSession = await auth.logOut();
    if (logoutSession) {
      dispatch(removeSession());
    }
    dispatch(finishLoading());
  } catch (e) {
    console.error('error.', e);
    throw e;
  }
};
