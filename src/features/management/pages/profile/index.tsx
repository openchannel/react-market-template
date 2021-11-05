import * as React from 'react';
import { set, merge, get } from 'lodash';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ChangePasswordRequest } from '@openchannel/react-common-services';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { OcEditUserFormComponent } from '@openchannel/react-common-components/dist/ui/auth/organisms';
import { OcNavigationBreadcrumbs } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { OcForm, OcFormFormikHelpers, OcFormValues } from '@openchannel/react-common-components/dist/ui/form/organisms';

import { MainTemplate } from 'features/common/templates';
import { useTypedSelector } from 'features/common/hooks';
import { changePassword } from 'features/common/store/session';
import { loadUserProfileForm, saveUserData } from 'features/common/store/user-types';

import { formConfigsWithoutTypeData, formPassword } from './constants';

import './styles.scss';

const Profile = (): JSX.Element => {
  const [isSelectedPage, setSelectedPage] = React.useState('myProfile');
  const dispatch = useDispatch();
  const history = useHistory();
  const formWrapperRef = React.useRef<HTMLDivElement>(null);
  const { configs, account, isLoading } = useTypedSelector(({ userTypes }) => userTypes);

  const onClickPass = React.useCallback((e) => {
    setSelectedPage(e.target.dataset.link);
  }, []);

  React.useEffect(() => {
    dispatch(loadUserProfileForm(formConfigsWithoutTypeData, false, true));
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

  const handleMyProfileSubmit = async (value: OcFormValues, { setErrors }: OcFormFormikHelpers) => {
    try {
      const selectedForm = formWrapperRef?.current?.querySelector('.select-component__text')?.innerHTML;
      const selectFormConfig = configs.filter((config) => config.name === selectedForm);

      const newAccount = Object.entries(value).reduce((acc, [k, v]) => {
        set(acc, k, v);
        return acc;
      }, {} as OcFormValues);

      newAccount.type = get(selectFormConfig, '[0]account.type');
      const next = merge(account, newAccount);

      await dispatch(saveUserData(next));
      notify.success('Your profile has been updated');
      // eslint-disable-next-line
    } catch (e: any) {
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
      <div className="bg-container height-unset">
        <OcNavigationBreadcrumbs pageTitle="My profile" navigateText="Back" navigateClick={history.goBack} />
      </div>

      <div className="container mb-8">
        <div className="page-navigation row" ref={formWrapperRef}>
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
            {isSelectedPage === 'myProfile' && !isLoading && (
              <OcEditUserFormComponent
                formConfigs={configs}
                defaultFormType={defaultProfileFormType}
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
