import { Dispatch } from 'redux';
import {
  apps,
  frontend,
  AppResponse,
  formsService,
  ownershipService,
  CreateOwnershipModel,
  ReqHeaders,
} from '@openchannel/react-common-services';
import { Filter, FullAppData } from '@openchannel/react-common-components';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';

import { MappedFilter, Gallery, Searchable } from '../../types';
import { mapAppData, mapFilters } from '../../lib/map';
import { ActionTypes } from './action-types';
import { SelectedFilters } from './types';
import { RootState } from '../../../../types';
import { FormButtonAction } from 'features/common/components/action-button/types';

export interface CreateFormSubmissionModel {
  formId: string;
  name: string;
  appId: string;
  userId: string;
  email: string;
  formData: unknown;
}

const startLoading = () => ({ type: ActionTypes.START_LOADING });
const finishLoading = () => ({ type: ActionTypes.FINISH_LOADING });
const resetSearchPayload = () => ({ type: ActionTypes.RESET_SELECTED_FILTERS });
const setGalleries = (payload: Gallery[]) => ({ type: ActionTypes.SET_GALLERIES, payload });
const updateMyApps = (payload: Partial<Searchable<FullAppData>>) => ({ type: ActionTypes.UPDATE_MY_APPS, payload });
const resetMyApps = () => ({ type: ActionTypes.RESET_MY_APPS });
const setFilters = (payload: Filter[]) => ({ type: ActionTypes.SET_FILTERS, payload });
const updateSearchPayload = (payload: SelectedFilters) => ({
  type: ActionTypes.SET_SELECTED_FILTERS,
  payload,
});
const setFilteredApps = (payload: AppResponse[]) => ({ type: ActionTypes.SET_FILTERED_APPS, payload });
const setSelectedApp = (payload: FullAppData) => ({ type: ActionTypes.SET_SELECTED_APP, payload });
const setRecommendedApps = (payload: FullAppData[]) => ({ type: ActionTypes.SET_RECOMMENDED_APPS, payload });
const resetFilteredApps = () => ({ type: ActionTypes.RESET_FILTERED_APPS });
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

export const fetchFilteredApps =
  (searchText: string, fields: string[], query?: string) => async (dispatch: Dispatch) => {
    dispatch(startLoading());
    try {
      const { data } = await apps.searchApp(searchText, query, fields);
      dispatch(setFilteredApps(data.list));
      dispatch(finishLoading());
    } catch (error) {
      dispatch(finishLoading());

      throw error;
    }
  };

export const setSearchPayload =
  ({ filters, searchStr }: Partial<SelectedFilters>) =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const {
      apps: { selectedFilters },
    } = getState();
    const searchPayload = {
      filters: filters != null ? filters : selectedFilters?.filters,
      searchStr: searchStr != null ? searchStr : selectedFilters?.searchStr,
    };
    dispatch(updateSearchPayload(searchPayload));
  };

export const clearSelectedFilters = () => (dispatch: Dispatch) => {
  dispatch(resetSearchPayload());
};

export const clearFilteredApps = () => (dispatch: Dispatch) => {
  dispatch(resetFilteredApps());
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

export const fetchMyApps = (pageNumber: number, limit: number, sort: string) => async (dispatch: Dispatch) => {
  dispatch(startLoading());

  try {
    dispatch(updateMyApps({ sort }));
    const sortFields = JSON.stringify({ [sort === 'featured' ? 'attributes.featured' : 'created']: -1 });
    const {
      data: { list, pages },
    } = await apps.getApps(pageNumber, limit, sortFields, '', true);
    const myApps = list.map(mapAppData);

    dispatch(updateMyApps({ data: myApps, pageNumber, limit, pages, sort }));
    dispatch(finishLoading());
  } catch (error) {
    dispatch(finishLoading());

    throw error;
  }
};

export const clearMyApps = () => (dispatch: Dispatch) => {
  dispatch(resetMyApps());
};

export const fetchSelectedApp = (safename: string, appId?: string) => async (dispatch: Dispatch) => {
  dispatch(startLoading());
  try {
    const { data } =
      appId && appId.length > 0 && !safename ? await apps.getAppById(appId) : await apps.getAppBySafeName(safename);
    dispatch(setSelectedApp(data));
    dispatch(finishLoading());
  } catch (error) {
    dispatch(finishLoading());

    throw error;
  }
};

export const fetchRecommendedApps = () => async (dispatch: Dispatch) => {
  dispatch(startLoading());

  try {
    const { data } = await apps.getApps(1, 3, '{randomize: 1}', "{'status.value':'approved'}");
    const recApps = data.list.map((app) => mapAppData(app));
    dispatch(setRecommendedApps(recApps));
    dispatch(finishLoading());
  } catch (error) {
    dispatch(finishLoading());
    throw error;
  }
};

export const getForm = (formAction: FormButtonAction) => async (dispatch: Dispatch) => {
  dispatch(startLoading());
  try {
    const { data } = await formsService.getForm(formAction?.formId);
    dispatch(finishLoading());
    return data;
  } catch (error) {
    dispatch(finishLoading());
    throw error;
  }
};
export const submitForm = (appId: string, result: CreateFormSubmissionModel) => async (dispatch: Dispatch) => {
  dispatch(startLoading());
  try {
    const res = await formsService.createFormSubmission(result.formId, {
      name: result.name,
      appId: appId,
      userId: '',
      email: result.email,
      formData: {
        ...result,
      },
    });
    if (Object.keys(res).length > 0) {
      notify.success('Form submitted');
      dispatch(finishLoading());
    }
  } catch (error) {
    dispatch(finishLoading());
    throw error;
  }
};

export const installApplication =
  (ownership: CreateOwnershipModel, safename: string, headers?: ReqHeaders) => async (dispatch: Dispatch) => {
    dispatch(startLoading());
    try {
      const res = await ownershipService.installOwnership(ownership, headers);
      if (res.data) {
        const { data } = await apps.getAppBySafeName(safename);
        dispatch(setSelectedApp(data));
      }
      dispatch(finishLoading());
    } catch (error) {
      dispatch(finishLoading());
    }
  };

export const uninstallApplication =
  (ownershipId: string, safename: string, headers?: ReqHeaders) => async (dispatch: Dispatch) => {
    dispatch(startLoading());
    try {
      const res = await ownershipService.uninstallOwnership(ownershipId, headers);
      if (res.data) {
        const { data } = await apps.getAppBySafeName(safename);
        dispatch(setSelectedApp(data));
      }
      dispatch(finishLoading());
    } catch (error) {
      dispatch(finishLoading());
    }
  };
