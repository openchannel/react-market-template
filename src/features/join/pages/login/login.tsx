import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { OcLoginComponent } from '@openchannel/react-common-components';
import { nativeLogin, storage } from '@openchannel/react-common-services';

import companyLogo from '../../../../assets/img/company-logo-2x.png';
import { useTypedSelector } from '../../../common/hooks';
import { fetchAuthConfig } from '../../../common/store';

import './styles.scss';

export const LoginPage = (): JSX.Element => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { isLoaded, isLoading, isSsoLogin } = useTypedSelector(state => state.config);

  const [serverErrorValidation, setServerErrorValidation] = React.useState(false);

  React.useEffect(() => {
    // if (storage.isUserLoggedIn()) {
    //   history.replace('/env');
    // } else {
      dispatch(fetchAuthConfig())
    // }
  }, []);

  // React.useEffect(() => {
  //   if (!isLoading && isLoaded && isSsoLogin) {
  //   }
  // }, [isLoading, isLoaded, isSsoLogin]);

  const onSubmit = React.useCallback(
    async ({ email, password }) => {
      if (serverErrorValidation) {
        setServerErrorValidation(false);
      }

      try {
        const res = await nativeLogin.signIn({ email, password, isChecked: false });

        if (res.code === 'VALIDATION') {
          setServerErrorValidation(true);
        } else {
          // storage.persist(res.accessToken, res.refreshToken);
          // history.push('/env');
        }
      } catch (error) {
        console.error('error', error);
      }
    },
    [history, serverErrorValidation],
  );

  const onActivationLinkClick = React.useCallback(() => {}, []);

  return (
    <div className="bg-container pt-sm-5">
      <div className="login-position">
        <OcLoginComponent
          signupUrl="/signup"
          forgotPwdUrl="/forgot-password"
          handleSubmit={onSubmit}
          onActivationLinkClick={onActivationLinkClick}
          companyLogoUrl={companyLogo}
          isIncorrectEmail={serverErrorValidation}
        />
      </div>
    </div>
  );
};

export default LoginPage;
