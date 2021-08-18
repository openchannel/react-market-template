import * as React from 'react';
import { useDispatch } from 'react-redux';
import { OcFooter } from '@openchannel/react-common-components/dist/ui/common/organisms';

import { useTypedSelector } from '../hooks';
import { isEmpty } from '../libs/helpers';
import { fetchCmsContent } from '../store/cms-content';
import { socialLinks } from '../../../consts/social-links';

export const MainTemplate: React.FC = ({ children }) => {
	const dispatch = useDispatch();
	const { isLoading, footer } = useTypedSelector(({ cmsContent }) => cmsContent);

	React.useEffect(() => {
		if (isEmpty(footer) && !isLoading) {
			dispatch(fetchCmsContent());
		}
	}, []);

	return (
		<>
			{children}
			<OcFooter socialLinks={socialLinks} cmsData={footer} />
		</>
	);
}
