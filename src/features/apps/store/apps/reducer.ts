// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { ActionTypes } from './action-types';
import { Action, Apps } from './types';

const initialState = {
	isLoading: false,
	isLoaded: false,
	filters: [],
	galleries: [],
	featured: [],
};

// export const appsReducer = (state: CmsContent = initialState, action: Action): CmsContent => {
export const appsReducer = (state: Apps = initialState, action: Action): Apps => {
	switch (action.type) {
		case ActionTypes.START_LOADING: {
			return {
				...state,
				isLoaded: false,
				isLoading: true,
			};
		}

		case ActionTypes.FINISH_LOADING: {
			return {
				...state,
				isLoaded: true,
				isLoading: false,
			};
		}

		case ActionTypes.SET_GALLERIES: {
			return {
				...state,
				galleries: action.payload,
			};
		}

		default:
			return state;
	}
};
