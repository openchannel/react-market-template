import * as React from 'react';
import { OcFooter } from '@openchannel/react-common-components/dist/ui/common/organisms';

import { useTypedSelector } from '../hooks';
import { socialLinks } from '../../../consts/social-links';
import { Header } from '../components';

export const MainTemplate: React.FC = ({ children }) => {
  const { header, footer } = useTypedSelector(({ cmsContent }) => cmsContent);

  return (
    <>
      <Header cmsData={header} />
      {children}
      <OcFooter socialLinks={socialLinks} cmsData={footer} />
    </>
  );
};
