import { combineReducers } from 'redux';

import { configReducer as config } from './features/common/store/config';

export const rootReducer = combineReducers({
	config,
});
