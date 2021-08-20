import { FullAppData } from '@openchannel/react-common-components';
import type { FooterColumn } from '@openchannel/react-common-components';
import { Gallery } from '../../types';

import { ActionTypes } from './action-types';

type ContentItem = null | Record<string, any>;

type FooterContent = null | Record<string, never> | {
	logoImageURL: string;
	columnsDFA: FooterColumn[];
};

export interface Apps {
	isLoading: boolean;
	isLoaded: boolean;
	// filters: [],
	galleries: [] | Gallery[],
	// featured: [],
}

export type Action = {
	type: ActionTypes.SET_GALLERIES;
	payload: Gallery[];
} | {
	type: ActionTypes.START_LOADING;
} | {
	type: ActionTypes.FINISH_LOADING;
};
