import * as React from 'react';
import { OcFooter } from '@openchannel/react-common-components/dist/ui/common/organisms';

import { Header } from '../components';
import { useTypedSelector, useAuth } from '../hooks';
import { socialLinks } from '../../../consts/social-links';
import { useDispatch } from 'react-redux';
import { fetchAuthConfig } from '../store';

export const MainTemplate: React.FC = ({ children }) => {
  const { header, footer } = useTypedSelector(({ cmsContent }) => cmsContent);
  const { checkSession } = useAuth();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const check = async () => {
      try {
        await checkSession();
      } catch {
        // do nothing
      }
    };

    check();
    dispatch(fetchAuthConfig());
  }, []);

  return (
    <>
      <Header cmsData={header} />
      {children}
      <OcFooter socialLinks={socialLinks} cmsData={footer} />
    </>
  );
};
