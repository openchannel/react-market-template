import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

import './App.css';


const Navigation = () => {
  return (
    <nav>
      <ul>
        {
          routes.map((route, key) => (
            <li key={key}>
              <Link to={route.path}>{route.name}</Link>
            </li>
          ))
        }
      </ul>
    </nav>
  )
}

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => (
      <div>
        <h2>login to market</h2>
        <Navigation />
      </div>
    ),
  },
  {
    path: '/signup',
    name: 'Sign up',
    component: () => (
      <div>
        <h2>sign up to market</h2>
        <Navigation />
      </div>
    ),
  },
  {
    path: '/',
    name: 'Main',
    component: () => (
      <div>
        <h2>Hello dev1 market</h2>
        <Navigation />
      </div>
    ),
  },
];

const App = (): JSX.Element => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          {
            routes.map((route, key) => (
              <Route key={key} path={route.path} component={route.component} />
            ))
          }
        </Switch>
      </BrowserRouter>
    </div>
  );
};


export default App;
