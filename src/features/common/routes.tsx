import * as React from 'react';
import { Link } from 'react-router-dom';
import MainPage from './pages/main/main';

const ChartPage = React.lazy(() => import('../common/pages/chart'));

export const commonRoutes = [
  {
    path: '/chart',
    exact: true,
    protected: true,
    Component: ChartPage,
  },
  {
    path: '/env',
    exact: true,
    protected: true,
    Component: () => (
      <div>
        {['NODE_ENV', 'REACT_APP_PRODUCTION', 'REACT_APP_API_URL', 'REACT_APP_MARKETPLACE_NAME'].map((key) => (
          <p key={key}>
            {key}: {process.env[key]}
          </p>
        ))}
      </div>
    ),
  },
  {
    path: '/',
    exact: true,
    Component: MainPage /* () => (
			<>
				<div>Home page</div>
				<nav>
					<ul>
						<li><Link to="/login">Login page</Link></li>
						<li><Link to="/chart">Chart page</Link></li>
						<li><Link to="/env">Env page</Link></li>
					</ul>
				</nav>
			</>
		), */,
  },
];
