import { ActionTypes } from './action-types';
import {
  OcEditUserFormConfig,
  OcEditUserResult,
  TypeFieldModel,
  TypeModel,
} from '@openchannel/react-common-components';
import { userAccount, userAccountTypes, users } from '@openchannel/react-common-services';
import { Dispatch } from 'redux';
import { cloneDeep, keyBy } from 'lodash';
import { normalizeError } from '../utils';

const EMPTY_TYPE_RESPONSE = {
  list: [],
  pages: 1,
  count: 0,
  pageNumber: 1,
};

const startLoading = () => ({ type: ActionTypes.START_LOADING });
const finishLoading = () => ({ type: ActionTypes.FINISH_LOADING });
const saveConfig = (configs: OcEditUserFormConfig[]) => ({ type: ActionTypes.GET_USER_CONFIG, payload: { configs } });
const saveAccount = (account: OcEditUserResult) => ({ type: ActionTypes.GET_USER_ACCOUNT, payload: { account } });

export const getUserTypes = async (injectOrganizationType: boolean, configs: OcEditUserFormConfig[]) => {
  if (injectOrganizationType) {
    const orgTypesIDs = configs.map((config) => config?.organization?.type).filter((type) => type);
    const searchQuery = orgTypesIDs?.length > 0 ? `{'userTypeId':{'$in': ['${orgTypesIDs.join("','")}']}}` : '';

    if (searchQuery) {
      const response = await users.getUserTypes(searchQuery, '', 1, 100);

      return response.data;
    }
  }

  return EMPTY_TYPE_RESPONSE;
};

export const getUserAccountTypes = async (injectAccountType: boolean, configs: OcEditUserFormConfig[]) => {
  if (injectAccountType) {
    const accTypesIDs = configs.map((config) => config?.account?.type).filter((type) => type);
    const searchQuery = accTypesIDs?.length > 0 ? `{'userAccountTypeId':{'$in': ['${accTypesIDs.join("','")}']}}` : '';

    if (searchQuery) {
      const response = await userAccountTypes.getUserAccountTypes(1, 100, searchQuery);

      return response.data;
    }
  }
  return EMPTY_TYPE_RESPONSE;
};

export const loadUserProfileForm =
  (configs: OcEditUserFormConfig[], injectOrganizationTypes: boolean, injectAccountTypes: boolean) =>
  async (dispatch: Dispatch) => {
    dispatch(startLoading());

    try {
      const { list: userAccountTypes } = await getUserAccountTypes(injectAccountTypes, configs);
      const { list: organizationTypes } = await getUserTypes(injectOrganizationTypes, configs);
      const account = await getUserAccount();

      const accTypes = keyBy(userAccountTypes, 'userAccountTypeId');
      const orgTypes = keyBy(organizationTypes, 'userTypeId');

      if (injectAccountTypes || injectAccountTypes) {
        const newConfigs: OcEditUserFormConfig[] = cloneDeep(configs)
          .map((config) => {
            const accountTypeData = accTypes[config?.account?.type];
            const organizationTypeData = orgTypes[config?.organization?.type];

            // put account type
            if (injectAccountTypes) {
              if (accountTypeData) {
                config.account.typeData = accountTypeData as TypeModel<TypeFieldModel>;
              } else {
                console.error(config.account.type, ' is not a valid user account type');
                return null;
              }
            }

            // put organization type
            if (injectOrganizationTypes) {
              if (organizationTypeData) {
                config.organization.typeData = organizationTypeData as TypeModel<TypeFieldModel>;
              } else {
                console.error(config.organization.type, ' is not a valid user type');
                return null;
              }
            }

            Object.entries(account).forEach(([key, value]) =>
              config?.account?.typeData?.fields!.filter((f) => f.id === key).forEach((f) => (f.defaultValue = value)),
            );

            return config;
          })
          .filter((v) => v != null)
          .map((v) => v!);
        dispatch(saveConfig(newConfigs));
      } else {
        dispatch(saveConfig([]));
      }

      dispatch(finishLoading());
    } catch (error) {
      dispatch(finishLoading());
      throw error;
    }
  };

export const saveUserData = (accountData: OcEditUserResult) => async (dispatch: Dispatch) => {
  try {
    const { data: savedUser } = await userAccount.updateUserAccount(accountData);
    dispatch(saveAccount(savedUser));
  } catch (error: any) {
    throw normalizeError(error);
  }
};

export const getUserAccount = async () => {
  const { data: account } = await userAccount.getUserAccount();

  return account;
};
