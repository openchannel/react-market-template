import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { instance } from '@openchannel/react-common-services';
import { OcNotificationContainer } from '@openchannel/react-common-components/dist/ui/common/atoms';

import { CsrfWrapper } from './features/common/hocs';
import { Helmet } from './features/common/molecules';
import { Routes } from './routes';
import { store } from './store';

import './features/common/libs/interceptors';

import '@openchannel/react-common-components';// it's styles
import './theme.scss';
import './styles.scss';

instance.init({ url: process.env.REACT_APP_API_URL || '', headerName: 'X-CSRF-TOKEN' });

export const App = (): JSX.Element => (
  <>
    <Helmet />
    <OcNotificationContainer />
    <CsrfWrapper>
      <BrowserRouter>
        <Provider store={store}>
          <Routes />
        </Provider>
      </BrowserRouter>
    </CsrfWrapper>
  </>
);
