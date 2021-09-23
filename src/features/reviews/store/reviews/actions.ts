import { Dispatch } from 'redux';
import {
  Page,
  OCReviewDetailsResponse,
  SortResponse,
  reviews,
  frontend,
  SortValueResponse,
} from '@openchannel/react-common-services';
import { ActionTypes } from './action-types';
import { Option } from '../../../common/components/app-detail-data';

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
