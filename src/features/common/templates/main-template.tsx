import * as React from 'react';
import { OcFooter } from '@openchannel/react-common-components/dist/ui/common/organisms';

import { Header } from '../components';
import { useTypedSelector, useAuth } from '../hooks';
import { socialLinks } from '../../../consts/social-links';

export const MainTemplate: React.FC = ({ children }) => {
  const { header, footer } = useTypedSelector(({ cmsContent }) => cmsContent);
  const { checkSession } = useAuth();

  React.useEffect(() => {
    const check = async () => {
      try {
        await checkSession();
      } catch {
        // do nothing
      }
    };

    check();
  }, []);

  return (
    <>
      <Header cmsData={header} />
      {children}
      <OcFooter socialLinks={socialLinks} cmsData={footer} />
    </>
  );
};
