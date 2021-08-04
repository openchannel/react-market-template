import * as React from 'react';
import { User } from 'oidc-client';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { joinRoutes } from '../../join';
import { useTypedSelector } from '../hooks';
import { loginWithSSOTokens, tryLoginByRefreshToken } from '../store/session';

export const AuthWrapper: React.FC = ({ children }) => {
	const [isAuthWithOidcLoading, setAuthWithOidcLoading] = React.useState(false);
	const history = useHistory();
	const location = useLocation();
	const dispatch = useDispatch();
	const { isLoading: isSessionLoading } = useTypedSelector(state => state.session);
	const { isLoading: isOidcLoading, userManager, isSsoLogin } = useTypedSelector(state => state.oidc);

	const loginWithOidcTokens = async ({ id_token, access_token }: User) => {
		try {
			await dispatch(loginWithSSOTokens(id_token, access_token));
			history.replace('/');
		} catch (e) {
			console.error('e', e);
			setAuthWithOidcLoading(false);
		}
	};

	const authWithOidc = async () => {
		if (!userManager) return;

		const signInByOidc = async () => {
			try {
				await userManager.signinRedirect();
			} catch (e) {
				console.error('e', e);
				setAuthWithOidcLoading(false);
			}
		};

		const processResponse = async () => {
			try {
				const response = await userManager.signinRedirectCallback(location.hash);

				await loginWithOidcTokens(response);
			} catch {
				history.replace('/login');
			}
		};

		if (!location.hash) {
			await signInByOidc();
		} else {
			await processResponse()
		}
	}

	const checkAuthType = async () => {
		if (!userManager || !isSsoLogin) {
			history.replace('/login');
			return;
		}

		setAuthWithOidcLoading(true)
		await authWithOidc();
	}

	React.useEffect(() => {
		const checkSession = async () => {
			try {
				await dispatch(tryLoginByRefreshToken());

				const joinPaths = joinRoutes.map(({ path }) => path);
				if (joinPaths.includes(location.pathname)) {
					history.replace('/');
				}
			} catch {
				await checkAuthType();
			}
		};

		checkSession();
	}, []);

	if (isSessionLoading || isOidcLoading || isAuthWithOidcLoading) {
		return (
			<div>Authentication...</div>
		);
	}

	return (children as React.ReactElement);
};
