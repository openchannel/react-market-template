import React from 'react';

const LoginPage = React.lazy(()=>import('./pages/login/login'));
const ChartPage = React.lazy(()=>import('./pages/chart/chart'));

export const joinRoutes = [
	{
		path: '/login',
		exact: true,
		component: LoginPage,
	},
	{
		path: '/chart',
		exact: true,
		component: ChartPage,
	}
];
