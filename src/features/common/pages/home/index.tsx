import * as React from 'react';

import { AppList } from '../../organisms';
import { MainTemplate } from '../../templates';
import { Hero, GetStarted, Header } from '../../components';

import './style.scss';

export const HomePage = () => {
  return (
    <MainTemplate>
      <Header />
      <Hero />
      <AppList />
      <GetStarted />
    </MainTemplate>
  );
};

export default HomePage;
