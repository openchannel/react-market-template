import { ActionTypes } from './action-types';
import { Action, Reviews } from './types';

const initialState = {
  isLoading: false,
  isLoaded: false,
  reviewsByApp: null,
  sorts: [],
};

export const reviewsReducer = (state: Reviews = initialState, action: Action): Reviews => {
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
      return {
        ...state,
        reviewsByApp: action.payload,
      };
    }
    case ActionTypes.SET_REVIEWS_SORTS: {
      return {
        ...state,
        sorts: action.payload,
      };
    }

    default:
      return state;
  }
};
