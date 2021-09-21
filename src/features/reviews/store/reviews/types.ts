import { ActionTypes } from './action-types';
import { Page, OCReviewDetailsResponse } from '@openchannel/react-common-services';

export interface Apps {
  isLoading: boolean;
  isLoaded: boolean;
  reviewsByApp: null | Page<OCReviewDetailsResponse>;
}

export type Action =
  | {
      type: ActionTypes.SET_REVIEWS_BY_APP;
      payload: Page<OCReviewDetailsResponse>;
    }
  | {
      type: ActionTypes.START_LOADING;
    }
  | {
      type: ActionTypes.FINISH_LOADING;
    };
