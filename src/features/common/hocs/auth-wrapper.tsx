import * as React from 'react';
import { User } from 'oidc-client';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { joinRoutes } from '../../join';
import { useTypedSelector } from '../hooks';
import { loginWithSSOTokens, tryLoginByRefreshToken } from '../store/session';

export const AuthWrapper: React.FC = ({ children }) => {
	const [isRefreshLoading, setRefreshLoading] = React.useState(false);
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
			setRefreshLoading(false);
		}
	};

	const refreshByOidc = async () => {
		if (!userManager || !isSsoLogin) {
			setRefreshLoading(false);
			return;
		}

		const signInByOidc = async () => {
			try {
				await userManager.signinRedirect();
			} catch (e) {
				console.error('e', e);
				setRefreshLoading(false);
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
		if (!isSsoLogin) {
			history.replace('/login');
			return;
		}

		setRefreshLoading(true);
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

	if (isSessionLoading || isOidcLoading || isRefreshLoading) {
		return (
			<div>Authentication...</div>
		);
	}

	return (children as React.ReactElement);
};
