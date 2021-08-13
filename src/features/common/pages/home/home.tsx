import * as React from 'react';

import Hero from '../../components/hero/hero';
import { data } from '../../components/hero/dummy-data';

export const HomePage = () => {
  return (
    <div>
      <Hero data={data} customClass="" mainRouterLink="/details" />
      {/* <Search /> */}
      {/* <GetStarted /> */}
      {/* <Footer /> */}
    </div>
  );
};

export default HomePage;
