import * as React from 'react';
import { OcFooter } from '@openchannel/react-common-components/dist/ui/common/organisms';

import { useTypedSelector } from '../hooks';
import { socialLinks } from '../../../consts/social-links';
import { Header } from '../components';

export const MainTemplate: React.FC = ({ children }) => {
  const footer = useTypedSelector(({ cmsContent }) => cmsContent.footer);
  const header = useTypedSelector(({ cmsContent }) => cmsContent.header);

  return (
    <>
      <Header cmsData={header} />
      {children}
      <OcFooter socialLinks={socialLinks} cmsData={footer} />
    </>
  );
};
