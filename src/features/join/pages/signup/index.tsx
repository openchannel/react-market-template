import * as React from 'react';
import { useDispatch } from 'react-redux';
import { OcSignupComponent } from '@openchannel/react-common-components/dist/ui/auth/organisms';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';

import { nativeSignup } from '../../../common/store/session';
import { useTypedSelector } from '../../../common/hooks';
import { loadUserProfileForm } from '../../../common/store/user-types/actions';
import companyLogo from '../../../../../public/assets/img/company-logo-2x.png';
import doneIcon from '../../../../../public/assets/img/forgot-password-complete-icon.svg';
import { mockConfig } from './constants';
import './styles.scss';

const SignupPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const [serverErrorValidation, setServerErrorValidation] = React.useState(false);
  const [showSignupFeedbackPage, setShowSignupFeedbackPage] = React.useState(false);
  // eslint-disable-next-line
  const { configs } = useTypedSelector(({ userTypes }) => userTypes);
  const enablePasswordField = true;
  const enableTermsCheckbox = true;

  const prefixedConfigs =
    configs.length > 0
      ? configs.map((config) => ({
          ...config,
          account: {
            ...config.account!,
            includeFields: config!.account!.includeFields!.map((incField) => `acc--${incField}`),
            typeData: {
              ...config.account.typeData,
              fields: config!.account!.typeData!.fields!.map((field) => ({
                ...field,
                id: `acc--${field.id}`,
              })),
            },
          },
          fieldsOrder: config.fieldsOrder
            ? config.fieldsOrder.map((orderField) =>
                !orderField.includes('org--') ? `acc--${orderField}` : orderField,
              )
            : [],
          organization: {
            ...config.organization!,
            includeFields: config!.organization!.includeFields!.map((incField) => `org--${incField}`),
            typeData: {
              ...config!.organization!.typeData,
              fields: config!.organization!.typeData!.fields!.map((field) => ({
                ...field,
                id: `org--${field.id}`,
              })),
            },
          },
        }))
      : [];

  const requiredPrefixedFields = prefixedConfigs.map((config) => ({
    name: config.name,
    fields: [
      ...config.account!.typeData.fields!.filter((field) => field.attributes.required === true),
      ...config.organization!.typeData.fields!.filter((field) => field.attributes.required === true),
      enablePasswordField
        ? {
            id: 'password',
            name: 'password',
            type: 'password',
            label: 'Password',
            defaultValue: '',
            attributes: { required: true },
          }
        : undefined,
      enableTermsCheckbox
        ? {
            id: 'terms',
            name: 'terms',
            type: 'checkbox',
            defaultValue: false,
            attributes: { required: true },
          }
        : undefined,
    ].filter(Boolean),
  }));

  React.useEffect(() => {
    dispatch(loadUserProfileForm(mockConfig, true, true));
  }, []);

  // eslint-disable-next-line
  const onSubmit = (values: any) => {
    const selectedForm = document.querySelector('.select-component__text')?.innerHTML;
    const submitFieldsByFormType = requiredPrefixedFields.filter((config) => config.name === selectedForm);

    // eslint-disable-next-line
    const submitValues: any = {};
    submitFieldsByFormType[0].fields.map((field) => {
      if (values[field!.id]) {
        submitValues[field!.id.replace(/\b(?:acc--|org--)\b/g, '')] = values[field!.id];
      }
    });

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
      <div className="signup-position">
        {showSignupFeedbackPage && (
          <OcSignupComponent
            showSignupFeedbackPage
            forgotPasswordDoneUrl={doneIcon}
            loginUrl="/login"
            companyLogoUrl={companyLogo}
            enableTypesDropdown
            formConfigs={prefixedConfigs}
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
            formConfigs={prefixedConfigs}
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
