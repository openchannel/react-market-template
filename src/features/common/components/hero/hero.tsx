import * as React from 'react';
import { OcFeaturedAppsComponent, FeaturedAppsProps } from '@openchannel/react-common-components';

import './style.scss';

export const Hero = ({ data = [], customClass, mainRouterLink }: FeaturedAppsProps) => {
  return (
    <div className="bg-container height-unset d-flex flex-column align-items-center">
      <div className="container">
        <div className="row">
          <div className="page-info col-md-9 col-lg-7 text-center mx-auto">
            <h1 className="page-title">Your app marketplace</h1>
            <p className="page-description mb-4 text-secondary">
              A default design template for implementing your app directory with OpenChannel
            </p>
          </div>
        </div>
      </div>
      <div className="container featured-apps-container">
        {data?.length && (
          <OcFeaturedAppsComponent
            data={data}
            mainRouterLink={mainRouterLink}
            // navigationParam="safeName[0]"
            label="Featured"
            customClass={customClass}
          ></OcFeaturedAppsComponent>
        )}
      </div>
    </div>
  );
};

export default Hero;
