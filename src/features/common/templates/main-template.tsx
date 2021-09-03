import * as React from 'react';
import { OcFooter } from '@openchannel/react-common-components/dist/ui/common/organisms';

import { Header } from '../components';
import { useTypedSelector } from '../hooks';
import { SOCIAL_LINKS } from '../../../consts';

export const MainTemplate: React.FC = ({ children }) => {
  const { header, footer } = useTypedSelector(({ cmsContent }) => cmsContent);

  return (
    <>
      <Header cmsData={header} />
      {children}
      <OcFooter socialLinks={SOCIAL_LINKS} cmsData={footer} />
    </>
  );
};
