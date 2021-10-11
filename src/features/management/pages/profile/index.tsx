import * as React from 'react';
import { ChangePasswordRequest } from '@openchannel/react-common-services';
import { useHistory } from 'react-router-dom';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { OcForm } from '@openchannel/react-common-components/dist/ui/form/organisms';
import { OcNavigationBreadcrumbs } from '@openchannel/react-common-components/dist/ui/common/molecules';

import { MainTemplate } from '../../../common/templates';
import { useDispatch } from 'react-redux';

import './styles.scss';
import { changePassword } from '../../../common/store/session/actions';
import { OcEditUserFormComponent } from '@openchannel/react-common-components/dist/ui/auth/organisms';
import { loadUserProfileForm, saveUserData } from '../../../common/store/user-types';
import { useTypedSelector } from '../../../common/hooks';
import { formConfigsWithoutTypeData, formPassword } from './constants';
import { FormikHelpers, FormikValues } from 'formik';

const Profile = (): JSX.Element => {
  const [isSelectedPage, setSelectedPage] = React.useState('myProfile');
  const dispatch = useDispatch();
  const history = useHistory();
  const historyBack = React.useCallback(() => {
    history.goBack();
  }, [history.goBack]);
  const { configs, account } = useTypedSelector(({ userTypes }) => userTypes);
  const onClickPass = React.useCallback(
    (e) => {
      setSelectedPage(e.target.dataset.link);
    },
    [setSelectedPage],
  );

  React.useEffect(() => {
    dispatch(loadUserProfileForm(formConfigsWithoutTypeData, false, true));
  }, []);

  const handleChangePasswordSubmit = async (
    value: FormikValues,
    { resetForm, setErrors }: FormikHelpers<FormikValues>,
  ) => {
    try {
      await dispatch(changePassword(value as ChangePasswordRequest));
      resetForm();
      notify.success('Password has been updated');
      // eslint-disable-next-line
    } catch (e: any) {
      if (e.errors != null) {
        setErrors(e.errors);
      }
    }
  };

  const handleMyProfileSubmit = async (value: FormikValues, { setErrors }: FormikHelpers<FormikValues>) => {
    const next = {
      ...account,
      ...value,
    };
    try {
      await dispatch(saveUserData(next));
      notify.success('Your profile has been updated');
      // eslint-disable-next-line
    } catch (e: any) {
      if (e.errors != null) {
        setErrors(e.errors);
      }
    }
  };

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
              <OcForm formJsonData={formPassword} onSubmit={handleChangePasswordSubmit} successButtonText="Save" />
            )}
            {isSelectedPage === 'myProfile' && (
              <OcEditUserFormComponent
                formConfigs={configs}
                defaultEmptyConfigsErrorMessage=""
                enableCustomTerms
                onSubmit={handleMyProfileSubmit}
                enableTypesDropdown={true}
                submitText="Save"
              />
            )}
          </div>
        </div>
      </div>
    </MainTemplate>
  );
};

export default Profile;
