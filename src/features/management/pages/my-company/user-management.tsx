import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { OcMenuUserGrid } from '@openchannel/react-common-components/dist/ui/management/organisms';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../../common/hooks';
import { getAllUsers, sortMyCompany } from '../../../common/store/user-invites';
import { clearUserProperties } from '../../../common/store/user-invites/actions';
import {
  storage,
  userAccount,
  UserAccountGridModel,
  UserGridActionModel,
  userInvites,
} from '@openchannel/react-common-services';
import { OcConfirmationModalComponent } from '@openchannel/react-common-components/dist/ui/common/organisms';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';

const UserManagement: React.FC = () => {
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    isOpened: false,
    type: '',
    modalTitle: 'Delete invite',
    modalText: 'Are you sure you want to delete this invite?',
    confirmButtonText: 'Yes, delete invite',
    confirmButtonType: 'danger',
    userId: '',
  });
  console.log('state', state);
  const [isOpenInviteModal, setOpenInviteModal] = React.useState(false);
  const openInviteModal = React.useCallback(() => {
    setOpenInviteModal(true);
  }, []);

  const closeInviteModal = React.useCallback(() => {
    setOpenInviteModal(false);
  }, []);

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

  const userAction = (userAction: UserGridActionModel): void => {
    const user = findUserByAction(userAction);
    console.log('userAction.user', user);
    // if (user) {
    if (userAction.action) {
      switch (userAction.action) {
        case 'DELETE':
          console.log('switch.DELETE');
          deleteUser(userAction, user);
          break;
        case 'EDIT':
          console.log('switch.EDIT');
          // editUser(userAction, user);
          break;
        default:
          // tslint:disable-next-line:no-console
          console.error('Not implement');
      }
    } else {
      // tslint:disable-next-line:no-console
      console.error("Can't find user from mail array by action");
    }
  };

  const findUserByAction = (userAction: UserGridActionModel): UserAccountGridModel => {
    if (userProperties.data.list?.length > 0) {
      if (userAction?.inviteId) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return userProperties.data.list.filter((developer) => developer?.inviteId === userAction.inviteId)[0];
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return userProperties.data.list.filter((developer) => developer?.userAccountId === userAction.userAccountId)[0];
      }
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return null;
  };

  const deleteUser = (userAction: UserGridActionModel, user: UserAccountGridModel): void => {
    if (user?.inviteStatus === 'INVITED') {
      deleteInvite(user);
    } else if (user?.inviteStatus === 'ACTIVE') {
      deleteAccount(user);
    } else {
      // tslint:disable-next-line:no-console
      console.error('Not implement edit type : ', user?.inviteStatus);
    }
  };

  const deleteInvite = (user: UserAccountGridModel) => {
    console.log('const deleteInvite = (user', user);
    openInviteModal();
    setState({
      isOpened: true,
      type: 'invite',
      modalTitle: 'Delete invite invite',
      modalText: 'Are you sure you want to delete this inviteinvite?',
      confirmButtonText: 'Yes, delete invite',
      confirmButtonType: 'danger',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userId: user.inviteId,
    });
  };

  const deleteUserInviteInModal = async (user: UserAccountGridModel) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await userInvites.deleteUserInvite(user?.inviteId);
    deleteUserFromResultArray(user);
    notify.success('Invite has been deleted');
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  console.log('storage.getUserDetails.individualId', storage.getUserDetails.individualId);

  const deleteAccount = (user: UserAccountGridModel): void => {
    // if (user.userAccountId === authHolderService.userDetails.individualId) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (user.userAccountId === storage.getUserDetails.individualId) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      openDeleteModal('Delete user', "You can't delete yourself!", 'Ok', null, 'Close');
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      openDeleteModal(
        'Delete user',
        'Delete this user from the marketplace now?',
        'Yes, delete user',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        deleteUserAccountInModal(user),
      );
    }
  };

  const deleteUserInModal = async (user: UserAccountGridModel) => {
    console.log('const deleteUserInModal state', state);
    if (state.type === 'invite') {
      console.log('const deleteUserInModal = async (user', user);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await userInvites.deleteUserInvite(state.userId);
      deleteUserFromResultArray(user);
      notify.success('Invite has been deleted');
      console.log('const deleteUserInModal = async');
      closeInviteModal();
    }

    if (state.type === 'user') {
      // dispatch
      // await userAccount.deleteUserAccount(user?.userAccountId);
      // deleteUserFromResultArray(user);
      // notify.success('User has been deleted from your organization');

      closeInviteModal();
    }
  };

  const openDeleteModal = (
    modalTitle: string,
    modalText: string,
    confirmText: string,
    deleteCallback: () => void,
    cancelText?: string,
  ): void => {
    // const modalSuspendRef = (
    //   <OcConfirmationModalComponent
    //     isOpened={true}
    //     onSubmit={deleteCallback}
    //     onClose={deleteCallback}
    //     onCancel={deleteCallback}
    //     modalTitle={modalTitle}
    //     modalText={modalText}
    //     confirmButtonText={confirmText}
    //   />
    // );
    // const modalSuspendRef = modal.open(OcConfirmationModalComponent, { size: 'md' });
    // modalSuspendRef.componentInstance.modalTitle = modalTitle;
    // modalSuspendRef.componentInstance.modalText = modalText;
    // modalSuspendRef.componentInstance.confirmButtonText = confirmText;
    // modalSuspendRef.componentInstance.confirmButtonType = 'danger';
    if (cancelText) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      modalSuspendRef.componentInstance.rejectButtonText = cancelText;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // modalSuspendRef.result.then(deleteCallback, () => {});
  };

  const deleteUserFromResultArray = (user: UserAccountGridModel): void => {
    if (userProperties.data.list?.length > 0) {
      const userIndex = userProperties.data.list.indexOf(user);
      if (userIndex >= 0) {
        userProperties.data.list.splice(userIndex, 1);
      }
    }
  };
  // const danger = 'danger'
  return (
    <>
      <InfiniteScroll
        dataLength={list.length}
        next={() => loadPage(pageNumber + 1)}
        hasMore={pageNumber < pages}
        loader={null}
        style={{ overflow: 'initial' }}
      >
        <OcMenuUserGrid
          onMenuClick={(e) => {
            console.log('e', e);
            userAction(e);
          }}
          onSort={catchSortChanges}
          properties={userProperties}
        />
        <OcConfirmationModalComponent
          isOpened={isOpenInviteModal}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onSubmit={deleteUserInModal}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onClose={closeInviteModal}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onCancel={closeInviteModal}
          modalTitle={state.modalTitle}
          modalText={state.modalText}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          confirmButtonType={state.confirmButtonType}
        />
      </InfiniteScroll>
    </>
  );
};

export default UserManagement;
