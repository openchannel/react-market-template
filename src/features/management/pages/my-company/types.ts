import { Permission, UserAccountGridModel } from '@openchannel/react-common-services';
import { UserAccountInviteStatusTypeModel } from '@openchannel/react-common-services/dist/model/api/user.model';

export interface UserData extends UserAccountGridModel {
  [index: string]: string | string[] | number | boolean | UserAccountInviteStatusTypeModel | undefined;
}

export type InviteModalState = { isOpened: boolean; user: UserData | null };

export interface InviteUserModalProps {
  userData: UserData | null;
  isOpened: boolean;
  closeModal(): void;
}

export interface Page {
  pageId: string;
  placeholder: string;
  permissions: Permission[];
}

export interface UserManagementProps {
  inviteModal: InviteModalState;
  openInviteModalWithUserData(user: UserData): void;
  closeInviteModal(): void;
}
