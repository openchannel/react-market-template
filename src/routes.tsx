import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import { joinRoutes } from './features/join';
import { commonRoutes } from './features/common';
import { OidcWrapper } from './features/common/hocs';
import { managementRoutes } from './features/management';

// commonRoutes must be last in the array
const routes = [...joinRoutes, ...managementRoutes, ...commonRoutes];

interface IRoute {
  path: string;
  exact: boolean;
  private: boolean;
  Component: React.LazyExoticComponent<React.FC<{}>>;
  children?: IRoute;
}

const RouteWithChildren = (route: IRoute) => {
  return (
    <Route
      path={route.path}
      render={(props) => (
        // pass the sub-routes down to keep nesting
        <route.Component {...props} children={route.children} />
      )}
    />
  );
};

export const Routes = (): JSX.Element => (
  <React.Suspense fallback={<div className="bg-container">Loading...</div>}>
    <Switch>
      {routes.map(({ Component, ...route }, key) => (
        <Route
          key={key}
          path={route.path}
          render={() =>
            route.private ? (
              <OidcWrapper>
                <Component />
              </OidcWrapper>
            ) : (
              <Component />
            )
          }
        />
      ))}
    </Switch>
  </React.Suspense>
);
