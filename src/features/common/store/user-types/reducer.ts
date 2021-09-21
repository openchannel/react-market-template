import { Action, UserTypes } from './types';
import { ActionTypes } from './action-types';

const initialState = {
  configs: [],
  account: {},
};

export const userTypesReducer = (state: UserTypes = initialState, action: Action): UserTypes => {
  switch (action.type) {
    case ActionTypes.GET_USER_CONFIG: {
      return {
        ...state,
        configs: action.payload.configs,
      };
    }

    case ActionTypes.GET_USER_ACCOUNT: {
      return {
        ...state,
        account: action.payload.account,
      };
    }

    default:
      return state;
  }
};
