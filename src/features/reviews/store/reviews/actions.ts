import { Dispatch } from 'redux';
import { Page, OCReviewDetailsResponse, reviews } from '@openchannel/react-common-services';
import { ActionTypes } from './action-types';

const startLoading = () => ({ type: ActionTypes.START_LOADING });
const finishLoading = () => ({ type: ActionTypes.FINISH_LOADING });
const setReviewsByApp = (payload: Page<OCReviewDetailsResponse>) => ({ type: ActionTypes.SET_REVIEWS_BY_APP, payload });

export const fetchReviewByAppId = (appId: string) => async (dispatch: Dispatch) => {
  dispatch(startLoading());

  try {
    const { data } = await reviews.getReviewsByAppId(appId);
    dispatch(setReviewsByApp(data));
    dispatch(finishLoading());
  } catch (error) {
    dispatch(finishLoading());

    throw error;
  }
};
