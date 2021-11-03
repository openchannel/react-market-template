import * as React from 'react';
import { useDispatch } from 'react-redux';
import { OcSignupComponent } from '@openchannel/react-common-components/dist/ui/auth/organisms';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';

import { nativeSignup } from '../../../common/store/session';
import { useTypedSelector } from '../../../common/hooks';
import { loadUserProfileForm } from '../../../common/store/user-types/actions';
import companyLogo from '../../../../../public/assets/img/company-logo-2x.png';
import doneIcon from '../../../../../public/assets/img/forgot-password-complete-icon.svg';
import {
  mockConfig,
  enablePasswordField,
  enableTermsCheckbox,
  ACCOUNT_PREFIX,
  ORGANIZATION_PREFIX,
  prefixRegex,
} from './constants';
import { prefixedConfigs } from './utils';
import './styles.scss';

const SignupPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const [serverErrorValidation, setServerErrorValidation] = React.useState(false);
  const [showSignupFeedbackPage, setShowSignupFeedbackPage] = React.useState(false);
  const formWrapperRef = React.useRef<HTMLDivElement>(null);
  const { configs } = useTypedSelector(({ userTypes }) => userTypes);

  React.useEffect(() => {
    dispatch(loadUserProfileForm(mockConfig, true, true));
  }, []);

  const prefixedFormConfigs = React.useMemo(() => prefixedConfigs(configs), [configs]);

  // eslint-disable-next-line
  const onSubmit = (values: any) => {
    const selectedForm = formWrapperRef.current?.querySelector('.select-component__text')?.innerHTML;
    const accType = configs.find((el) => el.name === selectedForm)?.account.type;
    const orgType = configs.find((el) => el.name === selectedForm)?.organization!.type;
    // eslint-disable-next-line
    const submitValues: any = {
      account: {
        type: accType,
        customData: {},
      },
      organization: {
        type: orgType,
        customData: {},
      },
    };

    for (const key in values) {
      key.includes(ACCOUNT_PREFIX)
        ? (submitValues.account[key.replace(prefixRegex, '').replace(`${accType}+`, '')] = values[key])
        : key.includes(ORGANIZATION_PREFIX)
        ? (submitValues.organization[key.replace(prefixRegex, '').replace(`${orgType}+`, '')] = values[key])
        : (submitValues[key.replace(prefixRegex, '')] = values[key]);
    }
    for (const accKey in submitValues.account) {
      if (accKey.includes('customData.')) {
        submitValues.account.customData[accKey.replace('customData.', '')] = submitValues.account[accKey];
        delete submitValues.account[accKey];
      }
    }
    for (const accKey in submitValues.organization) {
      if (accKey.includes('customData.')) {
        submitValues.organization.customData[accKey.replace('customData.', '')] = submitValues.organization[accKey];
        delete submitValues.organization[accKey];
      }
    }

    if (serverErrorValidation) {
      setServerErrorValidation(false);
    }
    try {
      dispatch(nativeSignup(submitValues));
      setShowSignupFeedbackPage(true);
      // eslint-disable-next-line
    } catch (error: any) {
      if (error.response.data.code === 'VALIDATION') {
        setServerErrorValidation(true);
      } else {
        notify.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="bg-container pt-sm-5">
      <div className="signup-position" ref={formWrapperRef}>
        {showSignupFeedbackPage && (
          <OcSignupComponent
            showSignupFeedbackPage
            forgotPasswordDoneUrl={doneIcon}
            loginUrl="/login"
            companyLogoUrl={companyLogo}
            enableTypesDropdown
            formConfigs={prefixedFormConfigs}
            onSubmit={onSubmit}
            enablePasswordField={enablePasswordField}
            enableTermsCheckbox={enableTermsCheckbox}
            defaultEmptyConfigsErrorMessage="There are no configuration"
            ordinaryTermsDescription={
              <>
                I agree to{' '}
                <a href="https://my.openchannel.io/terms-of-service" className="edit-user-form__content__link">
                  Terms of service
                </a>{' '}
                and{' '}
                <a className="edit-user-form__content__link" href="https://my.openchannel.io/data-processing-policy">
                  Data Processing Policy
                </a>
              </>
            }
          />
        )}
        {showSignupFeedbackPage === false && (
          <OcSignupComponent
            showSignupFeedbackPage={false}
            forgotPasswordDoneUrl={doneIcon}
            loginUrl="/login"
            companyLogoUrl={companyLogo}
            enableTypesDropdown
            formConfigs={prefixedFormConfigs}
            onSubmit={onSubmit}
            enablePasswordField
            enableTermsCheckbox
            defaultEmptyConfigsErrorMessage="There are no configuration"
            ordinaryTermsDescription={
              <>
                I agree to{' '}
                <a href="https://my.openchannel.io/terms-of-service" className="edit-user-form__content__link">
                  Terms of service
                </a>{' '}
                and{' '}
                <a className="edit-user-form__content__link" href="https://my.openchannel.io/data-processing-policy">
                  Data Processing Policy
                </a>
              </>
            }
          />
        )}
      </div>
    </div>
  );
};

export default SignupPage;
