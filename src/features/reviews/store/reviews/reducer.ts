import { ActionTypes } from './action-types';
import { Action, Apps } from './types';

const initialState = {
  isLoading: false,
  isLoaded: false,
  reviewsByApp: null,
};

export const reviewsReducer = (state: Apps = initialState, action: Action): Apps => {
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

    case ActionTypes.SET_REVIEWS_BY_APP: {
      const list = action.payload.list.map(({ description, ...rest }) => ({
        ...rest,
        review: description,
        description: '',
      }));
      const newPayload = { ...action.payload, list };
      return {
        ...state,
        reviewsByApp: newPayload,
      };
    }

    default:
      return state;
  }
};
