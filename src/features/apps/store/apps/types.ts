import { Gallery } from '../../types';
import { ActionTypes } from './action-types';
import {Filter, SidebarValue} from '@openchannel/react-common-components';

export interface Apps {
  isLoading: boolean;
  isLoaded: boolean;
  galleries: [] | Gallery[];
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
      type: ActionTypes.START_LOADING;
    }
  | {
      type: ActionTypes.FINISH_LOADING;
    };
