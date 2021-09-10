import { Gallery, Searchable } from '../../types';
import { ActionTypes } from './action-types';
import { Filter } from '@openchannel/react-common-components';
import { FullAppData } from '@openchannel/react-common-components/dist/ui/common/models';

export interface Apps {
  isLoading: boolean;
  isLoaded: boolean;
  galleries: [] | Gallery[];
  myApps: Searchable<FullAppData>;
  filters: [] | Filter[];
  // featured: [],
}

export type Action =
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
