import { combineReducers } from 'redux';

import {
  cmsContentReducer as cmsContent,
  sessionReducer as session,
  oidcReducer as oidc,
  userTypesReducer as userTypes,
  userInvitesReducer as userInvites,
} from './features/common/store';
import { appsReducer as apps } from './features/apps/store';

export const rootReducer = combineReducers({
  apps,
  cmsContent,
  oidc,
  session,
  userTypes,
  userInvites,
});
