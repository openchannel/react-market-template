import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { find } from 'lodash';

import {
  OcAppDescription,
  OcNavigationBreadcrumbs,
  OcDropdown,
  OcReviewListComponent,
  OcReviewComponent,
} from '@openchannel/react-common-components/dist/ui/common/molecules';
import { OcImageGalleryComponent, OcVideoComponent } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { OcRatingComponent } from '@openchannel/react-common-components/dist/ui/market/atoms';
import { OcOverallRating } from '@openchannel/react-common-components/dist/ui/market/organisms';
import { OcRecommendedAppsComponent, Modal } from '@openchannel/react-common-components/dist/ui/common/organisms';
import { FullAppData } from '@openchannel/react-common-components';
import { ReviewResponse } from '@openchannel/react-common-services';
import { ActionButton } from '../action-button';

import HelpIcon from '../../../../../public/assets/img/icon-help.svg';
import InternetIcon from '../../../../../public/assets/img/internet.svg';
import PadlockIcon from '../../../../../public/assets/img/padlock.svg';
import EmailIcon from '../../../../../public/assets/img/icon-email.svg';
import BubbleIcon from '../../../../../public/assets/img/speech-bubble.svg';
import { fetchRecommendedApps, fetchSelectedApp } from '../../../apps/store/apps/actions';
import DotsIcon from '../../../../../public/assets/img/dots-hr-icon.svg';
import {
  fetchReviewByAppId,
  fetchSorts,
  createReview,
  updateReview,
  deleteReview,
  fetchCurrentReview,
} from '../../../reviews/store/reviews/actions';
import { fetchUserId } from '../../store/session/actions';
import { useTypedSelector } from 'features/common/hooks';

import './style.scss';

export interface AppDetailsProps {
  app: FullAppData;
  price?: number;
  appListingActions?: any;
}
export interface Option {
  label: string;
  [key: string]: any;
}

export const AppDetails: React.FC<AppDetailsProps> = (props) => {
  const { app, price = 0, appListingActions = [] } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  React.useEffect(() => {
    setSortSelected({ label: '', value: '' });
    setFilterSelected({ label: 'All Stars', value: null });
    dispatch(fetchRecommendedApps());
    dispatch(fetchSorts());
    dispatch(fetchReviewByAppId(app.appId));
    dispatch(fetchUserId());
  }, [app]);
  const { recommendedApps } = useTypedSelector(({ apps }) => apps);
  const { reviewsByApp, sorts, currentReview } = useTypedSelector(({ reviews }) => reviews);
  const { userId } = useTypedSelector(({ session }) => session);
  const [isModalOpened, setIsModalOpened] = React.useState(false);
  const [isWritingReview, setIsWritingReview] = React.useState(false);
  const [sortSelected, setSortSelected] = React.useState<Option | undefined>({ label: '', value: '' });
  const [filterSelected, setFilterSelected] = React.useState<Option | undefined>({ label: 'All Stars', value: null });
  const [selectedAction, setSelectedAction] = React.useState<Option | undefined>({ label: 'Yee', value: 'yee' });

  const dropdownMenuOptions = ['EDIT', 'DELETE'];

  const historyBack = React.useCallback(() => {
    history.goBack();
  }, [history]);

  const onModalClose = React.useCallback(() => {
    setIsModalOpened(false);
  }, []);

  const handleDropdownClick = (appId: string, filter?: Option | undefined, sort?: Option | undefined) => {
    setSortSelected(sort);
    setFilterSelected(filter);
    dispatch(fetchReviewByAppId(appId, sort?.value, filter?.value));
  };

  const appGalleryImages = app.customData
    ? app?.customData?.images?.map((imageUrl: string) => {
        return { image: imageUrl, title: '', description: '' };
      })
    : [];

  const overallReviews = React.useMemo(() => {
    const reviewList: Array<number> = reviewsByApp?.list?.map((rev) => Math.round(rev.rating / 100)) || [];
    const countedReviews = {
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
    reviewList.forEach((review) => countedReviews[review]++);
    return countedReviews;
  }, [reviewsByApp]);

  const userReview = React.useMemo(() => {
    const hasUserReview = reviewsByApp ? !!find(reviewsByApp.list, ['userId', userId]) : false;
    return hasUserReview;
  }, [reviewsByApp]);

  const onReviewSubmit = (review: ReviewResponse): void => {
    // reviewSubmitInProgress = true;
    const reviewData: ReviewResponse = {
      ...review,
      appId: app.appId,
    };
    dispatch(createReview(reviewData));
    dispatch(fetchSelectedApp(app.safeName[0]));
    dispatch(fetchReviewByAppId(app.appId));
    setIsWritingReview(false);
  };

  const onChosenReviewActon = (option: 'EDIT' | 'DELETE'): void => {
    switch (option) {
      case 'EDIT':
        editReview();
        return;
      case 'DELETE':
        removeReview();
        return;
      default:
        return;
    }
  };

  const editReview = (): void => {
    dispatch(fetchCurrentReview(currentReview.reviewId));
    setIsWritingReview(true);
  };

  const removeReview = (): void => {
    dispatch(deleteReview(currentReview.reviewId, app.appId));
  };

  // const renderActionButtonForm = () => {

  //   return (

  //   )
  // }

  return (
    <>
      <div className="bg-container bg bg-s pb-7">
        <div className="container container_custom">
          <div className="app-detail__back-link height-unset">
            <div className="d-flex flex-row align-items-center">
              <OcNavigationBreadcrumbs pageTitle="" navigateText="Back" navigateClick={historyBack} />
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
                  disabled={true}
                />
                {appListingActions?.length > 0 && (
                  <div className="actions-container">
                    {appListingActions?.map((action: any, index: number) => (
                      <ActionButton buttonAction={action} inProcess={false} key={index} />
                    ))}
                  </div>
                )}
                <Modal isOpened={isModalOpened} onClose={onModalClose}>
                  {/* {renderActionButtonForm} */}
                </Modal>
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
          </div>
          <div className="review-column">
            {!isWritingReview && (
              <OcReviewListComponent
                reviewList={reviewsByApp?.list || []}
                writeReviewPermission={app.ownership && !userReview}
                writeReview={() => setIsWritingReview(!isWritingReview)}
                reviewListTitle="Most recent reviews"
                setSelectedAction={setSelectedAction}
                currentUserId={userId}
                selectedAction={selectedAction}
                dropdownDefaultIcon={DotsIcon}
                dropdownActiveIcon={DotsIcon}
                dropdownMenuOptions={dropdownMenuOptions}
              >
                <div>
                  <OcDropdown
                    title="Sort by"
                    options={sorts}
                    onSelect={(selectedSort: Option | undefined) =>
                      handleDropdownClick(app.appId, filterSelected, selectedSort)
                    }
                    selected={sortSelected}
                  />
                  <OcDropdown
                    options={[
                      { label: 'All Stars', value: null },
                      { label: '5 Stars', value: `{'rating': 500}` },
                      { label: '4 Stars', value: `{'rating': 400}` },
                      { label: '3 Stars', value: `{'rating': 300}` },
                      { label: '2 Stars', value: `{'rating': 200}` },
                      { label: '1 Stars', value: `{'rating': 100}` },
                    ]}
                    title="Show"
                    onSelect={(selectedFilter: Option | undefined) =>
                      handleDropdownClick(app.appId, selectedFilter, sortSelected)
                    }
                    selected={filterSelected}
                  />
                </div>
              </OcReviewListComponent>
            )}
            {isWritingReview && (
              <OcReviewComponent
                heading="Write a review"
                onSubmit={onReviewSubmit}
                onReviewCancel={() => setIsWritingReview(false)}
                reviewData={currentReview}
                enableButtons
              />
            )}
          </div>
        </div>
      </div>
      {recommendedApps && (
        <div className="bg-container mt-5 pt-3 pb-4 px-3 px-md-0 py-md-8 min-height-auto">
          <div className="container">
            <OcRecommendedAppsComponent
              recommendedAppTitle="Recommended for you"
              appList={recommendedApps || []}
              routerLinkForOneApp="/details"
              clickByAppCard={() => {
                window.scroll(0, 0);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AppDetails;
