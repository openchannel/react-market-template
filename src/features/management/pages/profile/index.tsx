import * as React from 'react';
import { set, merge } from 'lodash';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ChangePasswordRequest } from '@openchannel/react-common-services';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { OcEditUserFormComponent } from '@openchannel/react-common-components/dist/ui/auth/organisms';
import { OcNavigationBreadcrumbs } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { OcSingleForm, OcFormFormikHelpers, OcFormValues } from '@openchannel/react-common-components/dist/ui/form/organisms';
import { apps, fileService } from '@openchannel/react-common-services';

import { useTypedSelector } from 'features/common/hooks';
import { MainTemplate } from 'features/common/templates';
import { changePassword } from 'features/common/store/session';
import { loadUserProfileForm, saveUserData } from 'features/common/store/user-types';

import { formConfigsWithoutTypeData, formPassword } from './constants';

import './styles.scss';

const mappedFileService = {
  fileUploadRequest: fileService.uploadToOpenChannel,
  fileDetailsRequest: fileService.downloadFileDetails,
};

const Profile = (): JSX.Element => {
  const [isSelectedPage, setSelectedPage] = React.useState('myProfile');
  const dispatch = useDispatch();
  const history = useHistory();
  const { configs, account, isLoading } = useTypedSelector(({ userTypes }) => userTypes);

  const onClickPass = React.useCallback((e) => {
    switch (e.target.dataset.link) {
      case 'myProfile':
        history.replace('/my-profile/profile-details');
        break;
      case 'changePassword':
        history.replace('/my-profile/password');
        break;
      default:
        break;
    }
    setSelectedPage(e.target.dataset.link);
  }, []);

  React.useEffect(() => {
    dispatch(loadUserProfileForm(formConfigsWithoutTypeData, false, true));
    switch (isSelectedPage) {
      case 'myProfile':
        history.replace('/my-profile/profile-details');
        break;
      case 'changePassword':
        history.replace('/my-profile/password');
        break;
      default:
        break;
    }
  }, []);

  const handleChangePasswordSubmit = async (value: OcFormValues, { resetForm, setErrors }: OcFormFormikHelpers) => {
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

  const handleMyProfileSubmit = async (value: OcFormValues, { setErrors, setSubmitting }: OcFormFormikHelpers) => {
    try {
      const formData = Object.entries(value).reduce((acc, [k, v]) => {
        if (k === 'info') {
          set(acc, 'type', v.formType);
        } else {
          set(acc, k, v);
        }
        return acc;
      }, {} as OcFormValues);

      merge(account, formData);

      await dispatch(saveUserData(account));

      setSubmitting(false);
      notify.success('Your profile has been updated');
      // eslint-disable-next-line
    } catch (e: any) {
      setSubmitting(false);
      if (e.errors != null) {
        setErrors(e.errors);
      }
    }
  };

  const defaultProfileFormType = React.useMemo(() => {
    if (configs.length > 0) {
      return configs.reduce((acc, config) => {
        // eslint-disable-next-line
        // @ts-ignore
        if (config.account.type === account.type) {
          acc = config.name;
        }

        return acc;
      }, '');
    }
  }, [configs, account]);

  return (
    <MainTemplate>
      <div className="bg-container height-unset management">
        <OcNavigationBreadcrumbs pageTitle="My profile" navigateText="Back" navigateClick={history.goBack} />
      </div>

      <div className="container mb-8">
        <div className="page-navigation row">
          <div className="col-lg-3 col-xxl-2">
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
          <div className="col-lg-4 mt-3 mt-lg-1 col-xxl-6">
            {isSelectedPage === 'changePassword' && (
              <OcSingleForm
                formJsonData={formPassword}
                onSubmit={handleChangePasswordSubmit}
                submitButtonText="Save"
                fileService={mappedFileService}
                service={apps}
                customSubmitClass="full-width"
              />
            )}
            {isSelectedPage === 'myProfile' && !isLoading && (
              <OcEditUserFormComponent
                formConfigs={configs}
                defaultFormType={defaultProfileFormType}
                onSubmit={handleMyProfileSubmit}
                submitButtonText="Save"
                customSubmitClass="full-width"
              />
            )}
          </div>
        </div>
      </div>
    </MainTemplate>
  );
};

export default Profile;
