import { ActionTypes } from './action-types';
import { Page, OCReviewDetailsResponse } from '@openchannel/react-common-services';
import { Option } from '../../../common/components/app-detail-data';

export interface Reviews {
  isLoading: boolean;
  isLoaded: boolean;
  reviewsByApp: null | Page<OCReviewDetailsResponse>;
  sorts: [] | Option[];
}

export type Action =
  | {
      type: ActionTypes.SET_REVIEWS_BY_APP;
      payload: Page<OCReviewDetailsResponse>;
    }
  | {
      type: ActionTypes.SET_REVIEWS_SORTS;
      payload: Option[];
    }
  | {
      type: ActionTypes.START_LOADING;
    }
  | {
      type: ActionTypes.FINISH_LOADING;
    };
