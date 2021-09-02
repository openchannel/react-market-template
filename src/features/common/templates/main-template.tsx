import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { OcFooter } from '@openchannel/react-common-components/dist/ui/common/organisms';

import { socialLinks } from '../../../consts/social-links';
import { Header } from '../components';
import { fetchAuthConfig } from '../store';
import { useTypedSelector, useAuth, useCmsData } from '../hooks';

export const MainTemplate: React.FC = ({ children }) => {
  const location = useLocation();
  const { header, footer, getCmsData } = useCmsData();
  const { checkSession } = useAuth();
  const dispatch = useDispatch();
  const { isLoaded, isLoading } = useTypedSelector((state) => state.oidc);

  React.useEffect(() => {
    const check = async () => {
      try {
        await checkSession();
      } catch {
        // do nothing
      }
    };

    if (location.pathname === '/') {
      check();

      if (!isLoaded && !isLoading) {
        dispatch(fetchAuthConfig());
      }
    }
    getCmsData();
  }, []);

  return (
    <>
      <Header cmsData={header} />
      {children}
      <OcFooter socialLinks={socialLinks} cmsData={footer} />
    </>
  );
};
