import { ActionTypes } from './action-types';

export type Session = {
	isExist: boolean;
};

export type Action = {
	type: ActionTypes.SET;
} | {
	type: ActionTypes.REMOVE;
}
