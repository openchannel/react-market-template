import { ActionTypes } from './action-types';
import { Action, Session } from './types';

const initialState = {
	isExist: false,
};

export const sessionReducer = (state: Session = initialState, action: Action) => {
	switch (action.type) {
		case ActionTypes.SET: {
			return {
				...state,
				isExist: true,
			};
		}

		case ActionTypes.REMOVE: {
			return {
				...state,
				isExist: false,
			};
		}

		default:
			return state;
	}
};
