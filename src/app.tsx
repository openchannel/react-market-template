import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { instance } from '@openchannel/react-common-services';

import { CsrfWrapper } from './features/common/pages';
import { Routes } from './routes';
import { store } from './store';

import './theme.scss';
import './styles.scss';

instance.init({ url: process.env.REACT_APP_API_URL || '', headerName: 'X-CSRF-TOKEN' });

export const App = (): JSX.Element => {
  return (
    <Provider store={store}>
      <CsrfWrapper>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes />
        </Suspense>
      </CsrfWrapper>
    </Provider>
  );
};
