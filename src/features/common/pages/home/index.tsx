import * as React from 'react';

import { AppList } from '../../organisms';
import { MainTemplate } from '../../templates';
import { Hero, GetStarted } from '../../components';

import './style.scss';

export const HomePage = () => {
  return (
    <MainTemplate>
      <Hero />
      <AppList />
      <GetStarted />
    </MainTemplate>
  );
};

export default HomePage;
