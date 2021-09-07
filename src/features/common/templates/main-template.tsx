import * as React from 'react';
import { OcFooter } from '@openchannel/react-common-components/dist/ui/common/organisms';

import { Header } from '../components';
import { useCmsData } from '../hooks';
import { SOCIAL_LINKS } from '../../../consts';

export const MainTemplate: React.FC = ({ children }) => {
  const { header, footer, getCmsData } = useCmsData();

  React.useEffect(() => {
    getCmsData();
  }, []);

  return (
    <>
      <Header cmsData={header} />
      {children}
      <OcFooter socialLinks={SOCIAL_LINKS} cmsData={footer} />
    </>
  );
};
