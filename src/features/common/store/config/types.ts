import { ActionTypes } from './action-types';

export type Config = {
	isLoading: boolean;
	isLoaded: boolean;
	config: unknown;
	isSsoLogin: boolean;
};

export interface SetConfigAction {
	type: ActionTypes.SET_CONFIG;
	payload: {
		config: unknown | null;
		isSsoLogin: boolean;
	};
}

export type Action = SetConfigAction | {
	type: ActionTypes.START_LOADING;
} | {
	type: ActionTypes.FINISH_LOADING;
}
