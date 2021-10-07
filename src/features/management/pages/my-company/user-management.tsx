import * as React from 'react';
import { useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { UserGridActionModel } from '@openchannel/react-common-services';
import { OcMenuUserGrid } from '@openchannel/react-common-components/dist/ui/management/organisms';

import { useTypedSelector } from '../../../common/hooks';
import { getAllUsers, sortMyCompany, clearUserProperties } from '../../../common/store/user-invites';

import { getUserByAction } from './utils';
import { UserData, UserManagementProps } from './types';
import InviteUserModal from './components/invite-user-modal';

const UserManagement: React.FC<UserManagementProps> = ({
  inviteModal,
  openInviteModalWithUserData,
  closeInviteModal,
}) => {
  const dispatch = useDispatch();
  const { userProperties, sortQuery } = useTypedSelector(({ userInvites }) => userInvites);
  const { data } = userProperties;
  const { pageNumber, pages, list } = data;

  const catchSortChanges = (sortBy: string) => {
    dispatch(sortMyCompany(sortBy));
  };

  const loadPage = (page: number) => {
    dispatch(getAllUsers(page, sortQuery));
  };

  React.useEffect(() => {
    loadPage(pageNumber);

    return () => {
      dispatch(clearUserProperties());
    };
  }, []);

  const editUser = (userAction: UserGridActionModel, user: UserData) => {
    if (user?.inviteStatus === 'INVITED') {
      openInviteModalWithUserData(user);
    } else if (user?.inviteStatus === 'ACTIVE') {
      // editUserAccount(userAccount);
    } else {
      console.error('Not implement edit type : ', user?.inviteStatus);
    }
  };

  const onMenuClick = (userAction: UserGridActionModel) => {
    const user = getUserByAction(userAction, list);
    if (user) {
      switch (userAction.action) {
        case 'DELETE':
          break;
        case 'EDIT':
          editUser(userAction, user);
          break;
        default:
          console.error('Action is not implemented');
      }
    } else {
      console.error("Can't find user from mail array by action");
    }
  };

  return (
    <>
      <InviteUserModal userData={inviteModal.user} isOpened={inviteModal.isOpened} closeModal={closeInviteModal} />
      <InfiniteScroll
        dataLength={list.length}
        next={() => loadPage(pageNumber + 1)}
        hasMore={pageNumber < pages}
        loader={null}
        style={{ overflow: 'initial' }}
      >
        <OcMenuUserGrid onMenuClick={onMenuClick} onSort={catchSortChanges} properties={userProperties} />
      </InfiniteScroll>
    </>
  );
};

export default UserManagement;
