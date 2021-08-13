import React from 'react';

const LoginPage = React.lazy(() => import('./pages/login/login'));

export const joinRoutes = [
	{
		path: '/login',
		exact: true,
		protected: true,
		Component: LoginPage,
	},
];
