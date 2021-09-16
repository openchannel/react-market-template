import * as React from 'react';

const ProfilePage = React.lazy(() => import('./pages/profile'));
const MyAppsPage = React.lazy(() => import('./pages/my-apps'));

export const managementRoutes = [
  {
    path: '/management/apps',
    exact: true,
    private: true,
    Component: MyAppsPage,
  },
  {
    path: '/management/profile',
    exact: true,
    private: true,
    Component: ProfilePage,
  },
];
