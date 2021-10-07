import * as React from 'react';
import { update, cloneDeep, merge } from 'lodash';
import { useDispatch } from 'react-redux';
import { OcFormValues, AppFormField } from '@openchannel/react-common-components';
import { OcInviteModal, inviteFormConfig } from '@openchannel/react-common-components/dist/ui/common/organisms';

import { useTypedSelector } from '../../../../common/hooks';
import { inviteUser } from '../../../../common/store/user-invites';
import { inviteTemplateId } from '../constants';
import { InviteUserModalProps } from '../types';

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
          defaultValue: f.id === 'roles' ? { '': userData[f.id] } : userData[f.id],
        }));
      });
    }

    return config;
  }, [listRoles, userData]);

  const onSubmitInviteUser = React.useCallback(
    async (values: OcFormValues) => {
      // convert selected roles to correct format (['role']) before dispatch
      const roleIds = Object.entries(listRoles).reduce((list, [id, name]) => {
        if (values.roles.includes(name)) {
          list.push(id);
        }
        return list;
      }, [] as string[]);

      const payload = userData ? { ...userData } : {};
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

      await dispatch(inviteUser(payload, inviteTemplateId));
      closeModal();
    },
    [listRoles, closeModal],
  );

  return (
    <OcInviteModal
      size="sm"
      modalTitle="Invite a member"
      formConfig={updatedInviteFormConfig}
      isOpened={isOpened}
      onClose={closeModal}
      onSubmit={onSubmitInviteUser}
      buttonPosition="between"
    />
  );
});

export default InviteUserModal;
