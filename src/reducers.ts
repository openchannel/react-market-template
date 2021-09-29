import { combineReducers } from 'redux';

import {
  cmsContentReducer as cmsContent,
  sessionReducer as session,
  oidcReducer as oidc,
  userTypesReducer as userTypes,
} from './features/common/store';
import { appsReducer as apps } from './features/apps/store';
import { reviewsReducer as reviews } from './features/reviews/store';

export const rootReducer = combineReducers({
  apps,
  reviews,
  cmsContent,
  oidc,
  session,
  userTypes,
});
