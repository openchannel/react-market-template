import { ActionTypes } from './action-types';
import { Action, Session } from './types';

const initialState = {
  isLoading: false,
  isExist: false,
  accessToken: '',
  refreshToken: '',
};

export const sessionReducer = (state: Session = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.START_LOADING: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case ActionTypes.FINISH_LOADING: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case ActionTypes.SET: {
      return {
        ...state,
        isExist: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    }

    case ActionTypes.REMOVE: {
      return { ...initialState };
    }

    default:
      return state;
  }
};
