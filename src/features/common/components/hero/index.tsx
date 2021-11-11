import * as React from 'react';
import { OcFeaturedAppsComponent } from '@openchannel/react-common-components/dist/ui/common/organisms';

import { useCmsData, useTypedSelector } from '../../hooks';

import './style.scss';
import { getFeaturedApps } from '../../../apps/store/apps/actions';
import { useDispatch } from 'react-redux';

const Hero: React.FC = () => {
  const { home } = useCmsData();
  const { featured } = useTypedSelector(({ apps }) => apps);
  const dispatch = useDispatch();
  const featuredSort = JSON.stringify({ randomize: 1 });
  const featuredFilter = JSON.stringify({ 'attributes.featured': 'yes' });

  React.useEffect(() => {

    dispatch(getFeaturedApps(featuredSort, featuredFilter));
  }, []);

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
          data={featured}
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
