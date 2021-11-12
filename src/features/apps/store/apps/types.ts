import { Gallery, Searchable } from '../../types';
import { ActionTypes } from './action-types';
import { Filter, FullAppData, SidebarItem } from '@openchannel/react-common-components';
import { AppFormModelResponse } from '@openchannel/react-common-services';

export interface SelectedFilter extends SidebarItem {
  id: string;
}

export interface SelectedFilters {
  filters: SelectedFilter[];
  searchStr: string;
}
export interface Apps {
  isLoading: boolean;
  isLoaded: boolean;
  galleries: [] | Gallery[];
  myApps: Searchable<FullAppData>;
  filters: [] | Filter[];
  selectedFilters: SelectedFilters;
  filteredApps: [] | FullAppData[];
  selectedApp: null | FullAppData;
  appByVersion: null | FullAppData;
  recommendedApps: null | FullAppData[];
  currentForm: null | AppFormModelResponse;
}

export type Action =
  | {
      type: ActionTypes.SET_APP_BY_VERSION;
      payload: FullAppData;
    }
  | {
      type: ActionTypes.SET_CURRENT_FORM;
      payload: AppFormModelResponse;
    }
  | {
      type: ActionTypes.SET_RECOMMENDED_APPS;
      payload: FullAppData[];
    }
  | {
      type: ActionTypes.SET_SELECTED_APP;
      payload: FullAppData;
    }
  | {
      type: ActionTypes.RESET_SELECTED_FILTERS;
    }
  | {
      type: ActionTypes.SET_SELECTED_FILTERS;
      payload: SelectedFilters;
    }
  | {
      type: ActionTypes.SET_FILTERED_APPS;
      payload: FullAppData[];
    }
  | {
      type: ActionTypes.SET_FILTERS;
      payload: Filter[];
    }
  | {
      type: ActionTypes.SET_GALLERIES;
      payload: Gallery[];
    }
  | {
      type: ActionTypes.UPDATE_MY_APPS;
      payload: Searchable<FullAppData>;
    }
  | {
      type: ActionTypes.RESET_MY_APPS;
    }
  | {
      type: ActionTypes.START_LOADING;
    }
  | {
      type: ActionTypes.FINISH_LOADING;
    };
