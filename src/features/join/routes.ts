import React from 'react';

const LoginPage = React.lazy(() => import('./pages/login/login'));
const MainPage = React.lazy(() => import('../common/pages/main/main'));

export const joinRoutes = [
	{
		path: '/login',
		exact: true,
		protected: true,
		Component: LoginPage,
	},
{
		path: '/',
		exact: true,
		protected: true,
		Component: MainPage,
	},
];
