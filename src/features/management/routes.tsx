import * as React from 'react';

const ProfilePage = React.lazy(() => import('./pages/profile'));

export const managementRoutes = [
  {
    path: '/management/profile',
    exact: true,
    protected: true,
    Component: ProfilePage,
  },
];
