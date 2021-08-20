import { Dispatch } from 'redux';
import { apps, frontend, AppResponse } from '@openchannel/react-common-services';

import { NormalizedFilter, Gallery } from '../../types';
import { normalizeAppData, normalizeFilters } from '../../lib/normalize';
import { ActionTypes } from './action-types';

const startLoading = () => ({ type: ActionTypes.START_LOADING });
const finishLoading = () => ({ type: ActionTypes.FINISH_LOADING });
const setGalleries = (payload: Gallery[]) => ({ type: ActionTypes.SET_GALLERIES, payload });
// const setFeaturedApps = (payload: any) => ({ type: ActionTypes.SET_FEATURED, payload });

const getApps = async (
	pageNumber: number,
	limit: number,
	sort?: string,
	filter?: string,
): Promise<AppResponse[]> => {
	const { data } = await apps.getApps(pageNumber, limit, sort, filter);

	return data.list;
};

const getAppsByFilters = async (filters: NormalizedFilter[]) => {
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
		const filters = normalizeFilters(data.list);

		const filteredApps = await getAppsByFilters(filters);

		const galleries = filteredApps.reduce((acc, data, i) => {
			if (data.length > 0) acc.push({ ...filters[i], data: data.map(d => normalizeAppData(d)) });
			return acc;
		}, [] as Gallery[]);

		dispatch(setGalleries(galleries));
		dispatch(finishLoading());
	} catch (error) {
		dispatch(finishLoading());

		throw error;
	}
};


// export const fetchFeaturedApps = () => async (dispatch: Dispatch) => {
//
// }
