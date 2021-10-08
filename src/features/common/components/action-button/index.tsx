import * as React from 'react';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Modal } from '@openchannel/react-common-components/dist/ui/common/organisms';
import { notify, OcButtonComponent } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { auth, fileService, ownershipService, statisticService } from '@openchannel/react-common-services';
import { OcForm } from '@openchannel/react-common-components/dist/ui/form/organisms';
import {
  ButtonAction,
  ButtonForm,
  DownloadButtonAction,
  FormButtonAction,
  OwnershipButtonAction,
  ToasterMessages,
  ViewData,
} from './types';
import { getForm, submitForm } from '../../../apps/store/apps/actions';
import { useTypedSelector } from 'features/common/hooks';
import { isUserLoggedIn } from '../header/utils';
import { ReactComponent as CloseIcon } from '../../../../../public/assets/img/close-icon.svg';

import './style.scss';

export interface ActionButtonProps {
  buttonAction: ButtonAction;
  inProcess: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = (props) => {
  const { buttonAction, inProcess } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const { selectedApp } = useTypedSelector(({ apps }) => apps);
  const [viewData, setViewData] = React.useState<any>({
    actionType: null,
    viewData: null,
  });
  const [isModalOpened, setIsModalOpened] = React.useState(false);
  const [currentForm, setCurrentForm] = React.useState<any>({});

  const onModalClose = React.useCallback(() => {
    setIsModalOpened(false);
  }, []);

  const onFormSubmit = React.useCallback(
    (values) => {
      dispatch(submitForm(selectedApp!.appId, values));
      setIsModalOpened(false);
    },
    [selectedApp],
  );

  React.useEffect(() => {
    switch (buttonAction.type) {
      case 'form':
        setViewData({ actionType: null, viewData: buttonAction as FormButtonAction });
        break;
      case 'install':
        if (selectedApp?.ownership?.ownershipStatus === 'active') {
          setViewData({ actionType: 'OWNED', viewData: (buttonAction as OwnershipButtonAction)?.owned });
        } else {
          setViewData({ actionType: 'UNOWNED', viewData: (buttonAction as OwnershipButtonAction)?.unowned });
        }
        break;
      case 'download':
        setViewData({
          actionType: null,
          viewData: {
            button: (buttonAction as DownloadButtonAction).button,
            message: null,
          },
        });
        break;
      default:
        notify.error(`Error: invalid button type: ${buttonAction.type}`);
    }
  }, []);

  const handleButtonClick = (): void => {
    switch (buttonAction.type) {
      case 'form':
        processForm(buttonAction as FormButtonAction);
        break;
      case 'install':
        processOwnership();
        break;
      case 'download':
        downloadFile(buttonAction as DownloadButtonAction);
        break;
      default:
        notify.error(`Error: invalid button type: ${buttonAction.type}`);
    }
  };

  const processForm = async (formAction: FormButtonAction) => {
    const form = await dispatch(getForm(formAction));
    setCurrentForm(form);
    setIsModalOpened(true);
  };

  const processOwnership = (): void => {
    if (isUserLoggedIn()) {
      switch (buttonAction.type) {
        case 'OWNED':
          uninstallOwnership();
          break;
        case 'UNOWNED':
          installOwnership();
          break;
        default:
          notify.error(`Error: invalid owned button type: ${buttonAction.type}`);
      }
    } else {
      history.push(`/login?${window.location.pathname}`);
    }
  };

  const downloadFile = async (actionConfig: DownloadButtonAction) => {
    const file = get(selectedApp, actionConfig.fileField);
    const regex = new RegExp(/^(http(s)?:)?\/\//gm);
    if (regex.test(file)) {
      window.open(file);
    } else {
      const fileDetails = await fileService.downloadFileDetails(file, {});
      const fileUrl = fileService.getFileUrl(fileDetails.data.fileId).then((res) => window.open(res.data.url));

      if (buttonAction.statistic) {
        statisticService.record(buttonAction.statistic, selectedApp!.appId);
      }
    }
  };

  const installOwnership = (): void => {
    if (selectedApp && selectedApp?.model?.length > 0) {
      try {
        ownershipService.installOwnership(
          {
            appId: selectedApp.appId,
            modelId: selectedApp?.model[0].modelId,
          },
          { 'x-handle-error': '403, 500' },
        );
      } catch (error) {
        notify.error('You don’t have permission to install this app');
      }
    } else {
      notify.error('Missed any models for creating ownership.');
    }
  };

  const uninstallOwnership = (): void => {
    if (selectedApp && selectedApp.ownership) {
      try {
        ownershipService.uninstallOwnership(selectedApp.ownership.ownershipId, { 'x-handle-error': '403, 500' });
      } catch (error) {
        notify.error('You don’t have permission to uninstall this app');
      }
    }
  };
  return (
    <div className="action-button">
      <OcButtonComponent
        type="none"
        customClass={viewData?.viewData?.button.class}
        text={viewData?.viewData?.button.text}
        process={inProcess}
        disabled={inProcess}
        onClick={handleButtonClick}
      />
      <Modal isOpened={isModalOpened} onClose={onModalClose} className="modal-content" size="sm">
        <div className="action-button_modal">
          <div className="action-button_modal__header header">
            <h2 className="action-button_modal__header-heading">{currentForm.name || ''}</h2>
            <CloseIcon
              aria-label="close button"
              className="action-button_modal__header-close-icon"
              onClick={onModalClose}
            />
          </div>
          <div className="action-button_modal__modal-body">
            <OcForm formJsonData={currentForm} onSubmit={onFormSubmit} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ActionButton;
