import { ActionTypes } from './action-types';
import { OcEditUserFormConfig, OcEditUserResult } from '@openchannel/react-common-components';

export interface UserTypes {
  configs: OcEditUserFormConfig[];
  account: OcEditUserResult;
}

export type Action =
  | {
      type: ActionTypes.GET_USER_CONFIG;
      payload: {
        configs: OcEditUserFormConfig[];
      };
    }
  | {
      type: ActionTypes.GET_USER_ACCOUNT;
      payload: {
        account: OcEditUserResult;
      };
    };
