import { Dispatch } from 'redux';
import { auth, nativeLogin as native, storage, UserLoginModel } from '@openchannel/react-common-services';

import { ActionTypes } from './action-types';

const startLoading = () => ({ type: ActionTypes.START_LOADING });
const finishLoading = () => ({ type: ActionTypes.FINISH_LOADING });

const setSession = (payload: { accessToken: string, refreshToken: string }) => {
	storage.persist(payload.accessToken, payload.refreshToken);

	return { type: ActionTypes.SET, payload };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const removeSession = () => {
	storage.removeTokens();

	return { type: ActionTypes.REMOVE };
};

export const nativeLogin = (body: UserLoginModel) => async (dispatch: Dispatch) => {
	try {
		const response = await native.signIn(body);

		if (response.code === 'VALIDATION') {
			throw response;
		}

		dispatch(setSession(response));
		return response;

	} catch (error) {
		console.log('error', error)
		throw error;
	}
};

export const loginWithSSOTokens = (idToken: string, accessToken: string) => async (dispatch: Dispatch) => {
	dispatch(startLoading());

	try {
		const response = await auth.login({ idToken, accessToken });

		dispatch(setSession(response));
		dispatch(finishLoading());
		return response;

	} catch (e) {
		dispatch(finishLoading());
		console.log('e', e);
	}
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
		dispatch(finishLoading());
		console.error('Refresh token error.', e);
		throw e;
	}
};
