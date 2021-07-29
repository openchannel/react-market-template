import { auth } from '@openchannel/react-common-services';
import { Dispatch } from 'redux';

import { ActionTypes } from './action-types';
import { SetConfigAction } from './types';

const startLoading = () => ({ type: ActionTypes.START_LOADING });
const finishLoading = () => ({ type: ActionTypes.FINISH_LOADING });
const setConfig = (payload: SetConfigAction['payload']) => ({ type: ActionTypes.SET_CONFIG, payload });

export const fetchAuthConfig = () => async (dispatch: Dispatch) => {
	dispatch(startLoading());

	try {
		const config: unknown = await auth.getAuthConfig();

		dispatch(setConfig({
			config: config || null,
			isSsoLogin: Boolean(config),
		}));
	} catch (error) {
		console.error('error', error);
	} finally {
		dispatch(finishLoading());
	}
};
