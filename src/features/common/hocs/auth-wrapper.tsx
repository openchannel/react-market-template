import * as React from 'react';
import { User } from 'oidc-client';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { joinRoutes } from '../../join';
import { useTypedSelector } from '../hooks';
import { loginWithSSOTokens, tryLoginByRefreshToken } from '../store/session';

export const AuthWrapper: React.FC = ({ children }) => {
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
			console.error('e', e)
		}
	};

	const refreshByOidc = async () => {
		if (!userManager || !isSsoLogin) {
			return;
		}

		const signInByOidc = async () => {
			try {
				await userManager.signinRedirect();
			} catch (e) {
				console.error('e', e)
			}
		};

		const processResponse = async () => {
			try {
				const response = await userManager.signinRedirectCallback(location.hash);

				await loginWithOidcTokens(response);
			} catch {
				history.replace('/login', { from: location.pathname });
			}
		};

		if (!location.hash) {
			await signInByOidc();
		} else {
			await processResponse()
		}
	}

	const checkAuthType = async () => {
		if (!isSsoLogin) {
			history.replace('/login', { from: location.pathname });
			return;
		}

		await refreshByOidc();
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

	if (isSessionLoading || isOidcLoading) {
		return (
			<div>Authentication...</div>
		);
	}

	return (children as React.ReactElement);
};
