import * as React from 'react';
import { toast } from 'react-toastify';

import { ReactComponent as ToastErrorIcon } from '../../../../assets/img/toast-error.svg';
import { ReactComponent as ToastWarnIcon } from '../../../../assets/img/toast-warning.svg';
import { ReactComponent as ToastInfoIcon } from '../../../../assets/img/toast-info.svg';
import { ReactComponent as ToastSuccessIcon } from '../../../../assets/img/toast-success.svg';

interface INotifyMessage {
  message: string;
  icon: string;
}

interface IIcon {
  [key: string]: JSX.Element;
}

export const notify = {
  error: (message: string) => toast.error(<Msg message={message} icon="error" />),
  success: (message: string) => toast.success(<Msg message={message} icon="success" />),
  warning: (message: string) => toast.warning(<Msg message={message} icon="warn" />),
  info: (message: string) => toast.info(<Msg message={message} icon="info" />),
};

const icons: IIcon = {
  error: <ToastErrorIcon />,
  success: <ToastSuccessIcon />,
  warn: <ToastWarnIcon />,
  info: <ToastInfoIcon />,
};

const Msg = ({ message, icon }: INotifyMessage) => {
  return (
    <div className="rc-toast-container">
      {icons[icon]}
      <div className="rc-toast-message">{message}</div>
    </div>
  );
};
