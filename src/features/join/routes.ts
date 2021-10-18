import React from 'react';

const LoginPage = React.lazy(() => import('./pages/login'));
const ForgotPasswordPage = React.lazy(() => import('./pages/forgot-password'));

export const joinRoutes = [
  {
    path: '/login',
    exact: true,
    private: true,
    Component: LoginPage,
  },
  {
    path: '/forgot-password',
    exact: true,
    private: true,
    Component: ForgotPasswordPage,
  },
];
