import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import './theme.scss';
import './styles.scss';

import { routes } from './routes';

const App = (): JSX.Element => {
  return (
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
};

export default App;
