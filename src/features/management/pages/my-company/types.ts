import { Permission, UserAccountGridModel } from '@openchannel/react-common-services';
import { UserAccountInviteStatusTypeModel } from '@openchannel/react-common-services/dist/model/api/user.model';

export type InviteModalState = { isOpened: boolean; user: IndexedUserAccountGridModel | null };

export interface InviteUserModalProps {
  userData: IndexedUserAccountGridModel | null;
  isOpened: boolean;
  closeModal(): void;
}

export interface IndexedUserAccountGridModel extends UserAccountGridModel {
  [index: string]: string | string[] | number | boolean | UserAccountInviteStatusTypeModel | undefined;
}

export interface Page {
  pageId: string;
  placeholder: string;
  permissions: Permission[];
}

export interface UserManagementProps {
  inviteModal: InviteModalState;
  openInviteModalWithUserData(user: IndexedUserAccountGridModel): void;
  closeInviteModal(): void;
}
