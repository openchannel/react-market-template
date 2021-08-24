import * as React from 'react';

import { MainTemplate } from '../../templates';
import { Hero, GetStarted } from '../../components';
import { data } from '../../../../mocks/app-list';

import './style.scss';

export const HomePage = () => {
  return (
    <MainTemplate>
      <Hero data={data} customClass="" mainRouterLink="/details" />
      <GetStarted />
    </MainTemplate>
  );
};

export default HomePage;
