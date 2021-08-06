import * as React from 'react';
import { ToastContainer, toast, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { instance } from '@openchannel/react-common-services';

import { CsrfWrapper } from './features/common/hocs';
import { Helmet } from './features/common/libs';
import { Routes } from './routes';
import { store } from './store';

import './theme.scss';
import './styles.scss';

instance.init({ url: process.env.REACT_APP_API_URL || '', headerName: 'X-CSRF-TOKEN' });

export const App = (): JSX.Element => (
  <>
    <Helmet />
    <ToastContainer
      position="top-right"
      hideProgressBar
      autoClose={false}
      closeButton={false}
      newestOnTop={false}
      closeOnClick={false}
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
