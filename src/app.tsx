import * as React  from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { instance } from '@openchannel/react-common-services';

import { CsrfWrapper } from './features/common/hocs';
import { Routes } from './routes';
import { store } from './store';

import './theme.scss';
import './styles.scss';

instance.init({ url: process.env.REACT_APP_API_URL || '', headerName: 'X-CSRF-TOKEN' });

export const App = (): JSX.Element => (
  <CsrfWrapper>
    <BrowserRouter>
      <Provider store={store}>
        <Routes />
      </Provider>
    </BrowserRouter>
  </CsrfWrapper>
);
