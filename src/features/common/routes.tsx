import * as React from 'react';

const ChartPage = React.lazy(() => import('./pages/chart'));
const HomePage = React.lazy(() => import('./pages/home'));
const SearchPage = React.lazy(() => import('./pages/search'));
const DetailsPage = React.lazy(() => import('./pages/details'));

export const commonRoutes = [
  {
    path: '/details',
    exact: false,
    private: false,
    Component: DetailsPage,
  },
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
    path: '/',
    exact: true,
    Component: HomePage,
  },
];
