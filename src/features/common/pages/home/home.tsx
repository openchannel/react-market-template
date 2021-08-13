import * as React from 'react';

import Hero from '../../components/hero/hero';
import GetStarted from '../../components/get-started/get-started';
import { data } from '../../components/hero/dummy-data';
import './style.scss';

export const HomePage = () => {
  return (
    <>
      <Hero data={data} customClass="" mainRouterLink="/details" />
      {/* <Search /> */}
      <GetStarted />
      {/* <Footer /> */}
    </>
  );
};

export default HomePage;
