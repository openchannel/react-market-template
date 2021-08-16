import * as React from 'react';

import { Hero, GetStarted } from '../../components';
import { data } from '../../../../mocks/app-list';

import './style.scss';

export const HomePage = () => {
  return (
    <>
      <Hero data={data} customClass="" mainRouterLink="/details" />
      <GetStarted />
    </>
  );
};

export default HomePage;
