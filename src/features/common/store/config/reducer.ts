import { ActionTypes } from './action-types';
import { Action, Config } from './types';

const initialState = {
	isLoading: false,
	isLoaded: false,
	config: null,
	isSsoLogin: true,
};

export const configReducer = (state: Config = initialState, action: Action) => {
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

		case ActionTypes.SET_CONFIG: {
			return {
				...state,
				config: action.payload.config,
				isSsoLogin: action.payload.isSsoLogin,
			};
		}

		default:
			return state;
	}
};
