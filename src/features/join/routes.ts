import React from 'react';

const LoginPage = React.lazy(() => import('./pages/login'));
const ForgotPasswordPage = React.lazy(() => import('./pages/forgot-password'));
const ResetPasswordPage = React.lazy(() => import('./pages/reset-password'));
const ActivatePage = React.lazy(() => import('./pages/activate'));
const InvitedSignUpPage = React.lazy(() => import('./pages/invited-signup'));

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
  {
    path: '/reset-password',
    exact: true,
    private: true,
    Component: ResetPasswordPage,
  },
  {
    path: '/activate',
    exact: true,
    private: true,
    Component: ActivatePage,
  },
  {
    path: '/invite/:inviteId',
    Component: InvitedSignUpPage,
  },
];
