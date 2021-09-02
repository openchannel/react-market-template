import * as React from 'react';

import { OcNavigationBreadcrumbs } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { MainTemplate } from '../../../common/templates';

import './styles.scss';

const Profile = (): JSX.Element => {
  const historyBack = () => history.back();

  const [isSelectedPage, setSelectedPage] = React.useState('myProfile');

  const onClickPass = React.useCallback((e) => {
    console.log(e);
    setSelectedPage(e.target.dataset.link);
  }, []);

  return (
    <MainTemplate>
      <div className="bg-container height-unset">
        <OcNavigationBreadcrumbs pageTitle="My profile" navigateText="Back" navigateClick={historyBack} />
      </div>

      <div className="container">
        <div className="page-navigation row">
          <div className="col-md-3">
            <ul className="list-unstyled">
              <li>
                <span
                  className={`font-m ${isSelectedPage === 'myProfile' ? 'active-link' : ''}`}
                  role="button"
                  tabIndex={0}
                  data-link="myProfile"
                  onClick={onClickPass}
                  onKeyDown={onClickPass}
                >
                  Profile Details
                </span>
              </li>
              <li>
                <span
                  className={`font-m ${isSelectedPage === 'changePassword' ? 'active-link' : ''}`}
                  role="button"
                  tabIndex={0}
                  data-link="changePassword"
                  onClick={onClickPass}
                  onKeyDown={onClickPass}
                >
                  Password
                </span>
              </li>
            </ul>
          </div>
          <div className="col-md-5 col-lg-4 pt-1"></div>
        </div>
      </div>

      <div className="mt-8" />
    </MainTemplate>
  );
};

export default Profile;
