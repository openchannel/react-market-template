import { ActionTypes } from './action-types';
import { Action, Apps } from './types';

const initialState = {
  isLoading: false,
  isLoaded: false,
  galleries: [],
  myApps: {
    data: [],
    pageNumber: 1,
    limit: 5,
    pages: 0,
  },
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

    case ActionTypes.UPDATE_MY_APPS: {
      const newState = { ...state, myApps: { ...state.myApps, ...action.payload } };

      if (action.payload.pageNumber > state.myApps.pageNumber) {
        newState.myApps.data = [...state.myApps.data, ...action.payload.data];
      } else if (action.payload.data != null) {
        newState.myApps.data = [...action.payload.data];
      }

      return newState;
    }

    case ActionTypes.RESET_MY_APPS: {
      return { ...state, myApps: initialState.myApps };
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
    case ActionTypes.RESET_SELECTED_FILTERS: {
      return {
        ...state,
        selectedFilters: initialState.selectedFilters,
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
