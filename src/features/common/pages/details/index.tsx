import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useTypedSelector } from '../../hooks';
import { fetchSelectedApp } from '../../../apps/store/apps/actions';
import { MainTemplate } from '../../templates';
import AppDetails from '../../components/app-detail-data';

export const DetailsPage: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const appId = history.location.pathname.split('/')[2];
  const { selectedApp } = useTypedSelector(({ apps }) => apps);

  React.useEffect(() => {
    dispatch(fetchSelectedApp(appId));
  }, [history]);

  console.log(selectedApp);

  return (
    <MainTemplate>{selectedApp && <AppDetails appListingActions={[]} price={0} app={selectedApp} />}</MainTemplate>
  );
};

export default DetailsPage;
