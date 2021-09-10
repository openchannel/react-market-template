import { ActionTypes } from './action-types';
import { Action, Apps } from './types';

const initialState = {
  isLoading: false,
  isLoaded: false,
  galleries: [],
  filters: [],
  selectedFilters: {
    filters: [],
    searchStr: '',
  },
  filteredApps: [],
};

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

    case ActionTypes.SET_FILTERS: {
      return {
        ...state,
        filters: action.payload,
      };
    }

    case ActionTypes.SET_SELECTED_FILTERS: {
      return {
        ...state,
        selectedFilters: action.payload,
      };
    }
    case ActionTypes.SET_FILTERED_APPS: {
      return {
        ...state,
        filteredApps: action.payload,
      };
    }

    default:
      return state;
  }
};
