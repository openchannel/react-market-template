import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';
import {
  InviteUserModel,
  userAccountTypes,
  userInvites,
  nativeLogin, SignUpByInviteRequest,
} from '@openchannel/react-common-services';

import { GetState, TypedDispatch } from 'types';
import { logout } from '../../../common/store/session/actions';
import { mapDataToField } from '../../utils';

import { ActionTypes } from './action-types';

export const setUserInviteData = (payload: InviteUserModel) => ({
  type: ActionTypes.SET_USER_INVITES_DATA,
  payload,
});

const getUserAccountFormType = async (userInviteData: InviteUserModel) => {
  if (userInviteData.type) {
    try {
      const { data } = await userAccountTypes.getUserAccountType(userInviteData.type);

      return {
        ...data,
        fields: mapDataToField(data.fields, userInviteData),
      };
    } catch {
      console.error('Can\'t load UserAccountType');
      // return config which is presented bellow
    }
  }

  return {
    fields: [
      {
        id: 'name',
        label: 'Name',
        type: 'text',
        attributes: { required: false },
        defaultValue: userInviteData?.name,
      },
      {
        id: 'email',
        label: 'Email',
        type: 'emailAddress',
        attributes: { required: true },
        defaultValue: userInviteData?.email,
      },
      {
        id: 'password',
        label: 'Password',
        type: 'password',
        attributes: { required: true },
      },
    ],
  };
};

export const getUserInviteInfoByToken = (token: string) => async (dispatch: TypedDispatch) => {
  try {
    const { data } = await userInvites.getUserInviteInfoByToken(token);

    dispatch(setUserInviteData(data));

    const formConfig = await getUserAccountFormType(data);

    return {
      isExpired: data.expireDate ? new Date(data.expireDate) < new Date() : false,
      formConfig: {
        name: 'sign-up',
        account: {
          type: 'account-type',
          typeData: formConfig,
        },
      }
    };
  } catch {
    return {
      redirect: true,
    };
  }
};

export const sendInvite = (payload: SignUpByInviteRequest) => async (dispatch: TypedDispatch, getState: GetState) => {
  const { userInviteData } = getState().join;

  try {
    await nativeLogin.signupByInvite({ userCustomData: payload, inviteToken: userInviteData!.token! });
    // remove existed session. issue - AT-1082
    await dispatch(logout());

  } catch (error: unknown) {
    (error as { response: { data?: { errors?: [ { message: string; } ] } } }).response.data?.errors?.forEach((err: any) => notify.error(err.message));
    throw error;
  }
};
