import * as React from 'react';
import { update } from 'lodash';
import { useDispatch } from 'react-redux';
import { OcFormValues } from '@openchannel/react-common-components';
import { OcInviteModal, inviteFormConfig } from '@openchannel/react-common-components/dist/ui/common/organisms';

import { useTypedSelector } from '../../../../common/hooks';
import { inviteUser } from '../../../../common/store/user-invites';
import { inviteTemplateId } from '../constants';
import { InviteUserModalProps } from '../types';

const InviteUserModal: React.FC<InviteUserModalProps> = React.memo(({ isOpened, closeModal }) => {
  const dispatch = useDispatch();
  const { listRoles } = useTypedSelector(({ userInvites }) => userInvites);

  const updatedInviteFormConfig = React.useMemo(() => {
    const roleOptions = Object.entries(listRoles).reduce((list, [, name]) => {
      list.push(name);
      return list;
    }, [] as string[]);

    return update(inviteFormConfig, 'fields[2].options', () => roleOptions);
  }, [listRoles]);

  const onSubmitInviteUser = React.useCallback(
    async (values: OcFormValues) => {
      const roleIds = Object.entries(listRoles).reduce((list, [id, name]) => {
        if (values.roles.includes(name)) {
          list.push(id);
        }
        return list;
      }, [] as string[]);

      const formData = {
        name: values.name,
        email: values.email,
        roles: roleIds,
        customData: {
          roles: roleIds,
        },
      };

      await dispatch(inviteUser(formData, inviteTemplateId));
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
