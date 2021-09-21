import * as React from 'react';
import { useDispatch } from 'react-redux';
import {
  OcAppDescription,
  OcNavigationBreadcrumbs,
  OcDropdown,
  OcReviewListComponent,
  OcReviewComponent,
} from '@openchannel/react-common-components/dist/ui/common/molecules';
import {
  OcButtonComponent,
  OcImageGalleryComponent,
  OcVideoComponent,
} from '@openchannel/react-common-components/dist/ui/common/atoms';
import { OcRatingComponent } from '@openchannel/react-common-components/dist/ui/market/atoms';
import { OcOverallRating } from '@openchannel/react-common-components/dist/ui/market/organisms';
import { OcRecommendedAppsComponent } from '@openchannel/react-common-components/dist/ui/common/organisms';
import { FullAppData } from '@openchannel/react-common-components';

import HelpIcon from '../../../../../public/assets/img/icon-help.svg';
import InternetIcon from '../../../../../public/assets/img/internet.svg';
import PadlockIcon from '../../../../../public/assets/img/padlock.svg';
import EmailIcon from '../../../../../public/assets/img/icon-email.svg';
import BubbleIcon from '../../../../../public/assets/img/speech-bubble.svg';
// import { pageConfig } from '../../../../assets/config/configData';
// import { ButtonAction, DownloadButtonAction, FormButtonAction } from '../action-button/types';
import { fetchRecommendedApps } from '../../../apps/store/apps/actions';
import { fetchReviewByAppId } from '../../../reviews/store/reviews/actions';
import { useTypedSelector } from 'features/common/hooks';

import './style.scss';

export interface AppDetailsProps {
  app: FullAppData;
  price?: number;
  appListingActions?: any;
}

export const AppDetails: React.FC<AppDetailsProps> = (props) => {
  const { app, price = 0, appListingActions = [] } = props;
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchRecommendedApps());
    dispatch(fetchReviewByAppId(app.appId));
  }, []);
  const { recommendedApps } = useTypedSelector(({ apps }) => apps);
  const { reviewsByApp } = useTypedSelector(({ reviews }) => reviews);

  const appGalleryImages = app?.customData?.images.map((imageUrl: string) => {
    return { image: imageUrl, title: '', description: '' };
  });

  const reviewList: Array<number> = reviewsByApp?.list?.map((rev) => Math.round(rev.rating / 100)) || [];
  const overallReviews = {
    rating: app.rating / 100 || 0,
    reviewCount: reviewsByApp?.count || 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  reviewList.forEach((review) => overallReviews[review]++);

  const [isWritingReview, setIsWritingReview] = React.useState(false);

  // const getButtonActions = (config: any): ButtonAction[] => {
  //   const buttonActions = config?.appDetailsPage['listing-actions'];

  //   if (buttonActions && app?.type) {
  //     return buttonActions.filter((action: FormButtonAction) => {
  //       const isTypeSupported = action?.appTypes?.includes(app.type as string);
  //       const isNoDownloadType = action?.type !== 'download';
  //       const isFileFieldPresent = !!get(app, (action as unknown as DownloadButtonAction).fileField);

  //       return isTypeSupported && (isNoDownloadType || isFileFieldPresent);
  //     });
  //   }
  //   return [];
  // };

  return (
    <>
      <div className="bg-container bg bg-s pb-7">
        <div className="container container_custom">
          <div className="app-detail__back-link height-unset">
            <div className="d-flex flex-row align-items-center">
              <OcNavigationBreadcrumbs pageTitle="" navigateText="Back" navigateClick={() => {}} />
            </div>
          </div>
          <div className="app-detail__data">
            <div className="app-detail__data-description">
              {app?.customData?.logo && (
                <div className="col-md-auto mb-2 app-logo">
                  <img src={app?.customData?.logo} alt={`${app?.name || 'app-icon'}`} />
                </div>
              )}
              <div className="d-flex flex-column">
                <h1 className="mb-2 page-title-size">{app?.name}</h1>
                <span className="app-detail__price">{(price || app.model[0]?.price) === 0 && 'Free'}</span>
                <div className="text-secondary mt-1">{app?.customData.summary}</div>
                <OcRatingComponent
                  className="mb-3"
                  rating={app?.rating / 100 || 0}
                  reviewCount={app?.reviewCount || 0}
                  label="reviews"
                  labelClass="medium"
                  type="single-star"
                />
                {appListingActions?.length > 0 && (
                  <div className="actions-container">
                    {appListingActions?.map((action: any, index: number) => (
                      <OcButtonComponent
                        /* [appData]="app"
                      [buttonAction]="action"
                      (updateAppData)="getAppData()" 
                      className="action-button" */
                        key={index}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            {app?.video && <OcVideoComponent videoUrl={app?.video} />}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="mt-8 d-block">{appGalleryImages && <OcImageGalleryComponent gallery={appGalleryImages} />}</div>

        <div className="row mb-0 mb-md-8 mt-3 mt-md-8">
          <OcAppDescription
            showFullDescription
            appDescription={app?.customData.description as string}
            truncateTextLength={800}
            header="About"
            headerClass="mb-2"
          />
          <div className="app-detail__data-support col-md ml-md-8 mt-3 mt-md-0">
            <h2 className="app-detail__data-support-title mb-2 ">Support</h2>
            <ul className="list-group list-group-flush">
              {app?.customData['terms-of-service-url'] && (
                <li className="list-group-item">
                  <img src={HelpIcon} className="pr-2" alt="icon" />
                  <a className="support-link" href={app?.customData['terms-of-service-url']}>
                    F.A.Q.
                  </a>
                </li>
              )}
              {app?.customData['website-url'] && (
                <li className="list-group-item">
                  <img src={InternetIcon} className="pr-2" alt="icon" />
                  <a className="support-link" href={app?.customData['website-url']}>
                    Developer website
                  </a>
                </li>
              )}
              {app?.customData['terms-of-service-url'] && (
                <li className="list-group-item">
                  <img src={PadlockIcon} className="pr-2" alt="icon" />
                  <a className="support-link" href={app?.customData['terms-of-service-url']}>
                    Privacy Policy
                  </a>
                </li>
              )}
              {app?.customData['contact-email'] && (
                <li className="list-group-item link">
                  <img src={EmailIcon} className="pr-2" alt="icon" />
                  <a className="support-link" href={`mailto: ${app?.customData['contact-email']}`}>
                    {app?.customData['contact-email']}
                  </a>
                </li>
              )}
              {app?.customData['support-url'] && (
                <li className="list-group-item">
                  <img src={BubbleIcon} className="pr-2" alt="icon" />
                  <a className="support-link" href={app?.customData['support-url']}>
                    Support website
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="d-flex flex-wrap flex-md-nowrap">
          <div className="rating-column">
            <OcOverallRating allReviewSummary={overallReviews} />
            {/* <OcRatingComponent rating={app?.rating / 100 || 0} /> */}
          </div>
          <div className="review-column">
            {!isWritingReview && (
              <OcReviewListComponent
                // currentUserId={currentUserId}
                reviewList={reviewsByApp?.list || []}
                // totalReview={reviewsPage?.count}
                // allowWriteReview={app.ownership && !userReview}
                // writeReview={onNewReview}
                // chosenAction={onChosenReviewActon($event)}
                reviewListTitle="Most recent reviews"
              >
                <div>
                  <OcDropdown
                    options={/* reviewsSorts */ []}
                    onSelect={() => {}}
                    //  selected={selectedSort}
                    // (selectedChange)="onReviewSortChange($event)"
                    // className="mr-5"
                  />
                  <OcDropdown
                    options={/* reviewsFilter */ []}
                    title="Show"
                    onSelect={() => {}}
                    /* (selectedChange)="onReviewFilterChange($event)"
                  [selected]="selectedFilter" */
                  />
                </div>
              </OcReviewListComponent>
            )}
            {isWritingReview && (
              <OcReviewComponent
                heading="Write a review"
                // onSubmit={onReviewSubmit}
                // cancelReview={onCancelReview}
                // reviewData={userReview}
                enableButtons
              />
            )}
          </div>
        </div>
      </div>
      <div className="bg-container mt-5 pt-3 pb-4 px-3 px-md-0 py-md-8 min-height-auto" /* *ngIf="recommendedApps" */>
        <div className="container">
          <OcRecommendedAppsComponent
            recommendedAppTitle="Recommended for you"
            appList={recommendedApps || []}
            routerLinkForOneApp="/details"
            clickByAppCard={() => {}}
            /* appNavigationParam="safeName[0]" */
          />
        </div>
      </div>
    </>
  );
};

export default AppDetails;
