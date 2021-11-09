import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { NotFound } from '@openchannel/react-common-components/dist/ui/common/templates';

import image from '../../../../../public/assets/img/not-found-404.svg';

import { MainTemplate } from '../../templates';

import './style.scss';

export const NotFoundPage: React.FC = () => {
  const history = useHistory();

  const redirect = () => {
    history.push('/');
  };

  return (
    <MainTemplate>
      <NotFound errorImgUrl={image} onClick={redirect} buttonClassName="button-255" />
    </MainTemplate>
  );
};

export default NotFoundPage;
