import * as React from 'react';

import Hero from '../../components/hero/hero';
import Header from '../../components/header/index';
import { data } from '../../components/hero/dummy-data';
import './style.scss';

export const HomePage = () => {
  return (
    <div>
      <Header />
      <Hero data={data} customClass="" mainRouterLink="/details" />
      {/* <Search /> */}
      {/* <GetStarted /> */}
      {/* <Footer /> */}
    </div>
  );
};

export default HomePage;
