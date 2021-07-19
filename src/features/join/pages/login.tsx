import * as React from 'react';
import { OcLoginComponent } from '@openchannel/react-common-components';

import companyLogo from '../../../assets/img/company-logo-2x.png';

import './styles.scss';

export const LoginPage: React.FC<any> = () => {
	const onSubmit = React.useCallback(() => {

	}, []);

	const onActivationLinkClick = React.useCallback(() => {

	}, []);

	return (
		<div className="bg-container pt-sm-5">
			<div className="login-position">
				<OcLoginComponent
					signupUrl="/signup"
					forgotPwdUrl="/forgot-password"
					handleSubmit={onSubmit}
					onActivationLinkClick={onActivationLinkClick}
					companyLogoUrl={companyLogo}
				/>
			</div>
		</div>
	);
};
