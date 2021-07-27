import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { joinRoutes } from './features/join'

const routes = [
	...joinRoutes,
	{
		path: '/env',
		exact: true,
		component: () => (
			<div>
				{['NODE_ENV', 'REACT_APP_PRODUCTION', 'REACT_APP_API_URL', 'REACT_APP_MARKETPLACE_NAME'].map((key) => (
					<p key={key}>{key}: {process.env[key]}</p>
				))}
			</div>
		),
	}
];

export const Routes = (): JSX.Element => (
	<BrowserRouter>
		<Switch>
			{
				routes.map((route, key) => (
					<Route key={key} path={route.path} component={route.component} />
				))
			}
			<Redirect to="/login" />
		</Switch>
	</BrowserRouter>
);
