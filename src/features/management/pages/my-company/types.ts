import { Permission } from '@openchannel/react-common-services';

export interface InviteUserModalProps {
  isOpened: boolean;
  closeModal(): void;
}

export interface Page {
  pageId: string;
  placeholder: string;
  permissions: Permission[];
}
