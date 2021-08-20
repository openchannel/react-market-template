import * as React from 'react';
import { OcFooter } from '@openchannel/react-common-components/dist/ui/common/organisms';

import { useCmsData } from '../hooks';
import { socialLinks } from '../../../consts/social-links';

export const MainTemplate: React.FC = ({ children }) => {
	const { footer } = useCmsData();

	return (
		<>
			{children}
			<OcFooter socialLinks={socialLinks} cmsData={footer} />
		</>
	);
}
