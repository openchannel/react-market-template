import * as React from 'react';
import { OcFeaturedAppsComponent } from '@openchannel/react-common-components/dist/ui/common/organisms';

import { data } from '../../../../mocks/app-list';
import { useCmsData } from '../../hooks';

import './style.scss';

const Hero: React.FC = () => {
  const { home } = useCmsData();

  return (
    <div className="bg-container height-unset d-flex flex-column align-items-center">
      <div className="container">
        <div className="row">
          <div className="page-info col-md-9 col-lg-7 text-center mx-auto">
            <h1 className="page-title">{home?.pageInfoTitle}</h1>
            <p className="page-description mb-4 text-secondary">{home?.pageInfoSubtext}</p>
          </div>
        </div>
      </div>
      <div className="container featured-apps-container">
        <OcFeaturedAppsComponent
          data={data}
          mainRouterLink="/details"
          // navigationParam="safeName[0]"
          label="Featured"
          customClass=""
        />
      </div>
    </div>
  );
};

export default Hero;
