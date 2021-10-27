import * as React from 'react';
import { noop } from 'lodash';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { OcSignupComponent } from '@openchannel/react-common-components/dist/ui/auth/organisms';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';

import { getSearchParams } from '../../../common/libs/helpers';
import { nativeSignup } from '../../../common/store/session';
import { useTypedSelector } from '../../../common/hooks';
import { loadUserProfileForm } from '../../../common/store/user-types/actions';
import companyLogo from '../../../../../public/assets/img/company-logo-2x.png';
import './styles.scss';

const mockConfig = [
  {
    name: 'Default',
    organization: {
      type: 'default',
      typeData: {
        fields: [],
      },
      includeFields: ['name', 'customData.company'],
    },
    account: {
      type: 'default',
      typeData: {
        fields: [],
      },
      includeFields: ['name', 'email'],
    },
    fieldsOrder: ['name', 'email', 'org--name', 'password'],
  },
  {
    name: 'Custom',
    organization: {
      type: 'custom-user-type',
      typeData: {
        fields: [],
      },
      includeFields: ['name', 'customData.about-my-company'],
    },
    account: {
      type: 'custom-account-type',
      typeData: {
        fields: [],
      },
      includeFields: ['name', 'username', 'email', 'customData.about-me'],
    },
  },
];

const SignupPage = (): JSX.Element => {
  const history = useHistory();
  const dispatch = useDispatch();
  const searchParams = React.useMemo(() => getSearchParams(window.location.search), []);
  const [serverErrorValidation, setServerErrorValidation] = React.useState(false);
  // eslint-disable-next-line
  const { configs } = useTypedSelector(({ userTypes }) => userTypes);
  console.log('!!!', configs);

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
  console.log('!!!@@@', prefixedConfigs);

  React.useEffect(() => {
    dispatch(loadUserProfileForm(mockConfig, true, true, false));
  }, []);

  const onSubmit = React.useCallback(
    // eslint-disable-next-line
    async (values: any) => {
      const submitValues = {
        uname: values['acc--name'],
        email: values['acc--email'],
        company: values['org--name'],
        password: values.password,
      };

      if (serverErrorValidation) {
        setServerErrorValidation(false);
      }

      try {
        await dispatch(nativeSignup(submitValues));
        Object.keys(searchParams).includes('returnUrl') ? history.push(searchParams.returnUrl) : history.push('/');
        // eslint-disable-next-line
      } catch (error: any) {
        if (error.response.data.code === 'VALIDATION') {
          setServerErrorValidation(true);
        } else {
          notify.error(error.response.data.message);
        }
      }
    },
    [history, serverErrorValidation],
  );

  return (
    <div className="bg-container pt-sm-5">
      <div className="signup-position">
        <OcSignupComponent
          showSignupFeedbackPage={false}
          forgotPasswordDoneUrl="/forgot-password"
          loginUrl="/login"
          companyLogoUrl={companyLogo}
          enableTypesDropdown
          formConfigs={prefixedConfigs}
          onSubmit={onSubmit}
          enablePasswordField
          enableTermsCheckbox
          defaultTypeLabelText=""
          customTermsDescription=""
          goToActivationPage={noop}
          defaultEmptyConfigsErrorMessage="There are no configuration"
          ordinaryTermsDescription={
            <>
              I agree to{' '}
              <Link to="/" className="edit-user-form__content__link">
                Terms of service
              </Link>{' '}
              and{' '}
              <Link className="edit-user-form__content__link" to="/">
                Data Processing Policy
              </Link>
            </>
          }
        />
      </div>
    </div>
  );
};

export default SignupPage;
