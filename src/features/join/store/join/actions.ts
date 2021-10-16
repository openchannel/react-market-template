import {
    InviteUserModel,
    UserAccountTypeModel,
    userAccountTypes,
    userInvites,
} from '@openchannel/react-common-services';

import { TypedDispatch } from 'types';
import { mapDataToField } from '../../utils';
import { ActionTypes } from './action-types';

export const setUserInviteData = (payload: UserAccountTypeModel) => ({ type: ActionTypes.SET_USER_INVITES_DATA, payload });

const getFormType = (userInviteData: InviteUserModel) => async (dispatch: TypedDispatch) => {
    if (userInviteData.type) {
        try {
            const { data } = await userAccountTypes.getUserAccountType(userInviteData.type);

            dispatch(setUserInviteData(data));

            return {
                fields: mapDataToField(data.fields, userInviteData),
            };

        } catch {
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
                defaultValue: userInviteData?.name
            },
            {
                id: 'email',
                label: 'Email',
                type: 'emailAddress',
                attributes: { required: true },
                defaultValue: userInviteData?.email
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

        const formConfig = await getFormType(data)(dispatch);

        return {
            isExpired: data.expireDate ? new Date(data.expireDate) < new Date() : false,
            formConfig,
        };
    } catch {
        return {
            redirect: true,
        };
    }
};
