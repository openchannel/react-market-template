import React from 'react';

const LoginPage = React.lazy(() => import('./pages/login'));
const ForgotPasswordPage = React.lazy(() => import('./pages/forgot-password'));
const ResetPasswordPage = React.lazy(() => import('./pages/reset-password'));
const SignupPage = React.lazy(() => import('./pages/signup'));

export const joinRoutes = [
  {
    path: '/login',
    exact: true,
    private: true,
    Component: LoginPage,
  },
  {
    path: '/signup',
    exact: true,
    private: true,
    Component: SignupPage,
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
];
