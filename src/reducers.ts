import { combineReducers } from 'redux';

import { sessionReducer as session } from './features/common/store/session';
import { oidcReducer as oidc } from './features/common/store/oidc';

export const rootReducer = combineReducers({
	oidc,
	session,
});
