import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { get } from 'lodash';
import { ButtonAction, DownloadButtonAction, FormButtonAction } from '../../components/action-button/types';
import { pageConfig } from '../../../../assets/config/configData';
import { useTypedSelector } from '../../hooks';
import { fetchSelectedApp } from '../../../apps/store/apps/actions';
import { MainTemplate } from '../../templates';
import AppDetails from '../../components/app-detail-data';

export const DetailsPage: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const appSafeName = React.useMemo(() => history.location.pathname.split('/')[2], [history.location]);

  React.useEffect(() => {
    dispatch(fetchSelectedApp(appSafeName));
  }, [history.location, appSafeName]);

  const { selectedApp } = useTypedSelector(({ apps }) => apps);

  // eslint-disable-next-line
  const getButtonActions = (config: any): ButtonAction[] => {
    const buttonActions = config?.appDetailsPage['listing-actions'];

    if (buttonActions && selectedApp?.type) {
      return buttonActions.filter((action: FormButtonAction) => {
        const isTypeSupported = action?.appTypes?.includes(selectedApp.type as string);
        const isNoDownloadType = action?.type !== 'download';
        const isFileFieldPresent = !!get(selectedApp, (action as unknown as DownloadButtonAction).fileField);

        return isTypeSupported && (isNoDownloadType || isFileFieldPresent);
      });
    }
    return [];
  };
  const actions = getButtonActions(pageConfig);

  return (
    <MainTemplate>{selectedApp && <AppDetails appListingActions={actions} price={0} app={selectedApp} />}</MainTemplate>
  );
};

export default DetailsPage;
