import React from 'react';
import { instance } from '@openchannel/react-common-services';

import { CsrfWrapper } from './features/common/pages';

import { Routes } from './routes';

import './theme.scss';
import './styles.scss';

instance.init({ url: process.env.REACT_APP_API_URL || '', headerName: 'X-CSRF-TOKEN' });

export const App = (): JSX.Element => {
  return (
    <CsrfWrapper>
      <Routes />
    </CsrfWrapper>
  );
};
