import * as React from 'react';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { instance } from '@openchannel/react-common-services';

import { CsrfWrapper } from './features/common/hocs';
import { Helmet } from './features/common/molecules';
import { Routes } from './routes';
import { store } from './store';

import './features/common/libs/interceptors';

import 'react-toastify/dist/ReactToastify.min.css';
import './theme.scss';
import './styles.scss';

instance.init({ url: process.env.REACT_APP_API_URL || '', headerName: 'X-CSRF-TOKEN' });

export const App = (): JSX.Element => (
  <>
    <Helmet />
    <ToastContainer
      position="top-right"
      hideProgressBar
      autoClose={5000}
      closeButton={false}
      newestOnTop={false}
      closeOnClick={true}
      rtl={false}
      pauseOnFocusLoss
      draggable
    />
    <CsrfWrapper>
      <BrowserRouter>
        <Provider store={store}>
          <Routes />
        </Provider>
      </BrowserRouter>
    </CsrfWrapper>
  </>
);
