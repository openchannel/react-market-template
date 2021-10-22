import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { get } from 'lodash';
import { ButtonAction, DownloadButtonAction, FormButtonAction } from '../../components/action-button/types';
import { pageConfig } from '../../../../assets/config/configData';
import { useTypedSelector, useAuth } from '../../hooks';
import { getAppByVersion } from '../../../apps/store/apps/actions';
import { MainTemplate } from '../../templates';
import AppDetails from '../../components/app-detail-data';

export const AppVersionPage: React.FC = () => {
  const dispatch = useDispatch();
  const { checkSession, getAuthConfig, isConfigLoaded } = useAuth();
  const { appByVersion } = useTypedSelector(({ apps }) => apps);

  const params: { [key: string]: string } = useParams();

  React.useEffect(() => {
    window.scroll(0, 0);
    const init = async () => {
      try {
        checkSession();
      } catch {
        /*do nothing*/
      }

      if (!isConfigLoaded) {
        try {
          getAuthConfig();
        } catch {
          /*do nothing*/
        }
      }
    };

    init();
  }, []);

  React.useEffect(() => {
    dispatch(getAppByVersion(params.appId, Number(params.appVersion)));
  }, []);

  // eslint-disable-next-line
  const getButtonActions = (config: any): ButtonAction[] => {
    const buttonActions = config?.appDetailsPage['listing-actions'];

    if (buttonActions && appByVersion?.type) {
      return buttonActions.filter((action: FormButtonAction) => {
        const isTypeSupported = action?.appTypes?.includes(appByVersion.type as string);
        const isNoDownloadType = action?.type !== 'download';
        const isFileFieldPresent = !!get(appByVersion, (action as unknown as DownloadButtonAction).fileField);

        return isTypeSupported && (isNoDownloadType || isFileFieldPresent);
      });
    }
    return [];
  };
  const actions = React.useMemo(() => getButtonActions(pageConfig), [appByVersion]);

  return (
    <MainTemplate>
      {appByVersion && <AppDetails appListingActions={actions} price={0} app={appByVersion!} />}
    </MainTemplate>
  );
};

export default AppVersionPage;
