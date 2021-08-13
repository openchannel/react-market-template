import React from 'react';

const LoginPage = React.lazy(() => import('./pages/login/login'));
const HomePage = React.lazy(() => import('../common/pages/home/home'));

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
		protected: false,
		Component: HomePage,
	},
];
