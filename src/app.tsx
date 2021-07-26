import React, { Suspense } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import './theme.scss';
import './styles.scss';

import { routes } from './routes';

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          {routes.map((route, key) => (
            <Route key={key} path={route.path} component={route.component} />
          ))}
          <Route path="/env">
            <div>
              {Object.entries(process.env).map(([key, value]) => (
                <p key={key}>
                  {key}: {value}
                </p>
              ))}
            </div>
          </Route>
          <Redirect to="/login" />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
