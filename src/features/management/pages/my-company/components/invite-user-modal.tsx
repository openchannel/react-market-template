import * as React from 'react';
import { useDispatch } from 'react-redux';
import { update, cloneDeep, merge } from 'lodash';
import { OcFormValues, AppFormField } from '@openchannel/react-common-components';
import { OcInviteModal, inviteFormConfig } from '@openchannel/react-common-components/dist/ui/common/organisms';

import { useTypedSelector } from '../../../../common/hooks';
import { inviteUser, updateUser } from '../../../../common/store/user-invites';
import { inviteTemplateId } from '../constants';
import { InviteUserModalProps, UserData } from '../types';

const InviteUserModal: React.FC<InviteUserModalProps> = React.memo(({ userData, isOpened, closeModal }) => {
  const dispatch = useDispatch();
  const { listRoles } = useTypedSelector(({ userInvites }) => userInvites);

  const updatedInviteFormConfig = React.useMemo(() => {
    const config = cloneDeep(inviteFormConfig);

    // convert roles to a valid format for the oc-form
    const roleOptions = Object.entries(listRoles).reduce((list, [, name]) => {
      list.push(name);
      return list;
    }, [] as string[]);

    // set options to the 'select role' field
    update(config, 'fields[2].options', () => roleOptions);

    if (userData) {
      // set default value to the each field from the userData
      update(config, 'fields', (fields: AppFormField[]) => {
        return fields.map((f) => ({
          ...f,
          defaultValue: f.id === 'roles' ? userData[f.id]![0] : userData[f.id],
        }));
      });
    }

    return config;
  }, [listRoles, userData]);

  const onSubmitInviteUser = React.useCallback(
    async (values: OcFormValues) => {
      // convert selected roles to correct format (['role']) before dispatch
      const roleIds = Object.entries(listRoles).reduce((list, [id, name]) => {
        if ((values.roles || []).includes(name)) {
          list.push(id);
        }
        return list;
      }, [] as string[]);

      const payload = (userData ? cloneDeep(userData) : {}) as UserData;
      const formData = {
        name: values.name,
        email: values.email,
        roles: roleIds,
        customData: {
          roles: roleIds,
        },
      };

      // override existed userData
      merge(payload, formData);

      if (userData) {
        await dispatch(updateUser(userData.inviteId!, payload));
      } else {
        await dispatch(inviteUser(payload, inviteTemplateId));
      }

      closeModal();
    },
    [listRoles, userData, closeModal],
  );

  const isEditing = Boolean(userData);

  return (
    <OcInviteModal
      size="sm"
      modalTitle={isEditing ? 'Edit invite' : 'Invite a member'}
      buttonPosition="between"
      // todo: uncomment when @openchannel/react-common-components@0.1.56 is installed
      // successButtonText={isEditing ? 'Save' : 'Send Invite'}
      formConfig={updatedInviteFormConfig}
      isOpened={isOpened}
      onClose={closeModal}
      onSubmit={onSubmitInviteUser}
    />
  );
});

export default InviteUserModal;
