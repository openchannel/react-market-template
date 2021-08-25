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
		<div className="container">
			<div className="row mt-7">
				<div className="col-md-3 filter__container" id="main-content">
				</div>
				<div className="col-md-9">
					{/*{homePageConfig.appListPage.map((element) => (*/}
					{/*	<div className="mb-7">*/}
					{/*		<OcAppCategoriesComponent />*/}
					{/*	</div>*/}
					{/*))}*/}
					<div className="section-wrapper">
						{galleries.map((gallery) => (
							<OcAppGallery
								key={gallery.id}
								moreAppsTitle="See All"
								appsArr={gallery?.data}
								appGalleryTitle={gallery.label}
								appGalleryDescription={gallery.description}
								seeAllUrl={`/browse/${gallery.filterId}/${gallery.valueId}`}
								routerLinkForOneApp="/details"
								// appNavigationParam="safeName[0]"
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AppList;
