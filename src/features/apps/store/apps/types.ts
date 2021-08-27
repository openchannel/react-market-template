import { Gallery } from '../../types';
import { ActionTypes } from './action-types';

export interface Apps {
  isLoading: boolean;
  isLoaded: boolean;
  galleries: [] | Gallery[];
  filters: /* [] | any[] */ any;
  // featured: [],
}

export type Action =
  | {
      type: ActionTypes.SET_FILTERS;
      payload: any;
    }
  | {
      type: ActionTypes.SET_GALLERIES;
      payload: Gallery[];
    }
  | {
      type: ActionTypes.START_LOADING;
    }
  | {
      type: ActionTypes.FINISH_LOADING;
    };
