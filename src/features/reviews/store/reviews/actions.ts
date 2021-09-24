import { Dispatch } from 'redux';
import { isNil } from 'lodash';
import {
  Page,
  OCReviewDetailsResponse,
  SortResponse,
  reviews,
  frontend,
  SortValueResponse,
  ReviewResponse,
} from '@openchannel/react-common-services';
import { ActionTypes } from './action-types';
import { Option } from '../../../common/components/app-detail-data';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';

const startLoading = () => ({ type: ActionTypes.START_LOADING });
const finishLoading = () => ({ type: ActionTypes.FINISH_LOADING });
const setReviewsByApp = (payload: Page<OCReviewDetailsResponse>) => ({ type: ActionTypes.SET_REVIEWS_BY_APP, payload });
const setSorts = (payload: Option[]) => ({ type: ActionTypes.SET_REVIEWS_SORTS, payload });

export const fetchReviewByAppId = (appId: string, sort?: string, filter?: string) => async (dispatch: Dispatch) => {
  dispatch(startLoading());

  try {
    const { data } = await reviews.getReviewsByAppId(appId, sort, filter);
    dispatch(setReviewsByApp(data));
    dispatch(finishLoading());
  } catch (error) {
    dispatch(finishLoading());

    throw error;
  }
};

export const fetchSorts = () => async (dispatch: Dispatch) => {
  dispatch(startLoading());
  try {
    const allSorts: SortResponse[] = (await frontend.getSorts()).data.list;
    const responseSorts = allSorts.map((sort) => sort.values).flat();
    const convertedSorts: Option[] = responseSorts.map(
      (item: SortValueResponse): Option => ({ label: item.label, value: item.sort }),
    );
    dispatch(setSorts(convertedSorts));
    dispatch(finishLoading());
  } catch (error) {
    dispatch(finishLoading());

    throw error;
  }
};

export const createReview = (reviewData: ReviewResponse) => async (dispatch: Dispatch) => {
  dispatch(startLoading());
  try {
    const res = await reviews.createReview(reviewData);
    if (res) {
      const { data } = await reviews.getReviewsByAppId(reviewData.appId);
      dispatch(setReviewsByApp(data));
      dispatch(finishLoading());
    } else {
      dispatch(finishLoading());
      throw new Error();
    }
  } catch (error: any) {
    dispatch(finishLoading());
    error.response.data.errors.forEach((err: any) => notify.error(err.message));
    throw error;
  }
};

export const updateReview = (reviewData: ReviewResponse) => async (dispatch: Dispatch) => {
  dispatch(startLoading());
  try {
    const res = await reviews.updateReview(reviewData);
    if (res) {
      const { data } = await reviews.getReviewsByAppId(reviewData.appId);
      dispatch(setReviewsByApp(data));
      dispatch(finishLoading());
    } else {
      dispatch(finishLoading());
      throw new Error();
    }
  } catch (error) {
    dispatch(finishLoading());
    throw error;
  }
};
export const deleteReview = (reviewId: string, appId: string) => async (dispatch: Dispatch) => {
  dispatch(startLoading());
  try {
    const res = await reviews.deleteReview(reviewId);
    if (isNil(res)) {
      const { data } = await reviews.getReviewsByAppId(appId);
      dispatch(setReviewsByApp(data));
      dispatch(finishLoading());
    } else {
      dispatch(finishLoading());
      throw new Error();
    }
  } catch (error) {
    dispatch(finishLoading());
    throw error;
  }
};
