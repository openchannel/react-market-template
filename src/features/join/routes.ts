import React from 'react';

const LoginPage = React.lazy(() => import('./pages/login'));
const InvitedSignUpPage = React.lazy(() => import('./pages/invited-signup'));

export const joinRoutes = [
  {
    path: '/login',
    exact: true,
    private: true,
    Component: LoginPage,
  },
  {
    path: '/invite/:inviteId',
    Component: InvitedSignUpPage,
  },
];
