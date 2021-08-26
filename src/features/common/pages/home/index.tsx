import * as React from 'react';

import { MainTemplate } from '../../templates';
import { Hero, GetStarted, Header } from '../../components';
import { data } from '../../../../mocks/app-list';

import './style.scss';

export const HomePage = () => {
  return (
    <MainTemplate>
      <Header />
      <Hero data={data} customClass="" mainRouterLink="/details" />
      <GetStarted />
    </MainTemplate>
  );
};

export default HomePage;
