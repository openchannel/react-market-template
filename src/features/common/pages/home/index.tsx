import * as React from 'react';

import { useAuth } from '../../hooks';
import { AppList } from '../../organisms';
import { MainTemplate } from '../../templates';
import { Hero, GetStarted } from '../../components';

import './style.scss';

export const HomePage: React.FC = () => {
  const { checkSession, getAuthConfig, isConfigLoaded } = useAuth();

  React.useEffect(() => {
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

  return (
    <MainTemplate>
      <Hero />
      <AppList />
      <GetStarted />
    </MainTemplate>
  );
};

export default HomePage;
