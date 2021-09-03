import * as React from 'react';
import { ChangePasswordRequest } from '@openchannel/react-common-services';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { OcForm } from '@openchannel/react-common-components/dist/ui/form/organisms';
import { OcNavigationBreadcrumbs } from '@openchannel/react-common-components/dist/ui/common/molecules';

import { MainTemplate } from '../../../common/templates';
import { useDispatch } from 'react-redux';

import './styles.scss';
import { changePassword } from '../../../common/store/session/actions';

const form = {
  fields: [
    {
      id: 'password',
      label: 'Current Password',
      type: 'password',
      attributes: [],
      defaultValue: '',
    },
    {
      id: 'newPassword',
      label: 'New Password',
      type: 'password',
      attributes: [],
      defaultValue: '',
    },
  ],
};

const Profile = (): JSX.Element => {
  const historyBack = () => history.back();
  const [isSelectedPage, setSelectedPage] = React.useState('myProfile');
  const dispatch = useDispatch();

  const onClickPass = React.useCallback((e) => {
    setSelectedPage(e.target.dataset.link);
  }, []);

  return (
    <MainTemplate>
      <div className="bg-container height-unset">
        <OcNavigationBreadcrumbs pageTitle="My profile" navigateText="Back" navigateClick={historyBack} />
      </div>

      <div className="container mb-8">
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
          <div className="col-md-5 col-lg-4 pt-1">
            {isSelectedPage === 'changePassword' && (
              <OcForm
                formJsonData={form}
                onSubmit={async (value, { resetForm }) => {
                  await dispatch(changePassword(value as ChangePasswordRequest));
                  resetForm();

                  notify.success('Password has been updated');
                }}
                successButtonText="Save"
              />
            )}
          </div>
        </div>
      </div>
    </MainTemplate>
  );
};

export default Profile;
