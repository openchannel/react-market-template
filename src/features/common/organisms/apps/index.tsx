import * as React from 'react';
import { useDispatch } from 'react-redux';
import { OcAppGallery } from '@openchannel/react-common-components/dist/ui/market/organisms';
import { fetchGalleries } from '../../../apps/store/apps/actions';
import { useTypedSelector } from '../../hooks';

const AppList: React.FC = () => {
  const dispatch = useDispatch();
  const { galleries } = useTypedSelector(({ apps }) => apps);

  React.useEffect(() => {
    dispatch(fetchGalleries());
  }, []);

  return (
    <>
      {galleries.map((gallery) => (
        <div key={gallery.id} className="section-wrapper">
          <OcAppGallery
            moreAppsTitle="See All"
            appsArr={gallery?.data}
            appGalleryTitle={gallery.label}
            appGalleryDescription={gallery.description}
            seeAllUrl={`/browse/${gallery.filterId}/${gallery.valueId}`}
            routerLinkForOneApp="/details"
          />
        </div>
      ))}
    </>
  );
};

export default AppList;
