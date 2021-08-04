import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import { joinRoutes } from './features/join';
import { commonRoutes } from './features/common';
import { OidcWrapper } from './features/common/hocs';

const routes = [
	...joinRoutes,
	...commonRoutes,
];

export const Routes = (): JSX.Element => (
	<React.Suspense fallback={<div className="bg-container">Loading...</div>}>
		<Switch>
			{
				routes.map(({ Component, ...route }, key) => (
					<Route
						key={key}
						path={route.path}
						render={() => route.protected ? <OidcWrapper><Component /></OidcWrapper> : <Component />}
					/>
				))
			}
		</Switch>
	</React.Suspense>
);
