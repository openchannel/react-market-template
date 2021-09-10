import { Dispatch } from 'redux';
import { apps, frontend, AppResponse } from '@openchannel/react-common-services';

import { MappedFilter, Gallery } from '../../types';
import { mapAppData, mapFilters } from '../../lib/map';
import { ActionTypes } from './action-types';
import { Filter } from '@openchannel/react-common-components';

const startLoading = () => ({ type: ActionTypes.START_LOADING });
const finishLoading = () => ({ type: ActionTypes.FINISH_LOADING });
const setGalleries = (payload: Gallery[]) => ({ type: ActionTypes.SET_GALLERIES, payload });
const setFilters = (payload: Filter[]) => ({ type: ActionTypes.SET_FILTERS, payload });
// const setFeaturedApps = (payload: any) => ({ type: ActionTypes.SET_FEATURED, payload });

const getApps = async (pageNumber: number, limit: number, sort?: string, filter?: string): Promise<AppResponse[]> => {
  const { data } = await apps.getApps(pageNumber, limit, sort, filter);

  return data.list;
};

const getAppsByFilters = async (filters: MappedFilter[]) => {
  const requests = filters.map(({ sort, query }) => getApps(1, 4, sort, query));

  const responses = await Promise.allSettled(requests);

  return responses.reduce((acc, r) => {
    if (r.status === 'fulfilled') acc.push(r.value);
    return acc;
  }, [] as AppResponse[][]);
};

export const fetchGalleries = () => async (dispatch: Dispatch) => {
  dispatch(startLoading());

  try {
    const { data } = await frontend.getFilters();
    const filters = mapFilters(data.list);
    dispatch(setFilters(data.list));

    const filteredApps = await getAppsByFilters(filters);

    const galleries = filteredApps.reduce((acc, data, i) => {
      if (data.length > 0) acc.push({ ...filters[i], data: data.map((d) => mapAppData(d)) });
      return acc;
    }, [] as Gallery[]);

    dispatch(setGalleries(galleries));
    dispatch(finishLoading());
  } catch (error) {
    dispatch(finishLoading());

    throw error;
  }
};

export const fetchFilters = () => async (dispatch: Dispatch) => {
  dispatch(startLoading());

  try {
    const { data } = await frontend.getFilters();
    dispatch(setFilters(data.list));
    dispatch(finishLoading());
  } catch (error) {
    dispatch(finishLoading());

    throw error;
  }
};

// export const fetchFeaturedApps = () => async (dispatch: Dispatch) => {
//
// }
