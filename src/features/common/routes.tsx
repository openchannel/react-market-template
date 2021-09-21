import * as React from 'react';

const ChartPage = React.lazy(() => import('./pages/chart'));
const HomePage = React.lazy(() => import('./pages/home'));
const SearchPage = React.lazy(() => import('./pages/search'));

export const commonRoutes = [
  {
    path: '/browse',
    exact: false,
    //   private: true,
    Component: SearchPage,
  },
  {
    path: '/chart',
    exact: true,
    private: true,
    Component: ChartPage,
  },
  {
    path: '/env',
    exact: true,
    private: true,
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
    Component: HomePage,
  },
];
