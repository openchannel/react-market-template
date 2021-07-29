import { Dispatch } from 'redux';
import { storage } from '@openchannel/react-common-services';

import { ActionTypes } from './action-types';

export const setSession = (payload: { accessToken: string, refreshToken: string }) => (dispatch: Dispatch) => {
	storage.persist(payload.accessToken, payload.refreshToken);
	dispatch({ type: ActionTypes.SET });
};

export const removeSession = () => (dispatch: Dispatch) => {
	storage.removeTokens();
	dispatch({ type: ActionTypes.REMOVE });
};
