import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { OcLoginComponent } from '@openchannel/react-common-components/dist/auth/organisms';
import { notify } from '../../../common/components';
import { nativeLogin } from '../../../common/store/session';
import companyLogo from '../../../../assets/img/company-logo-2x.png';
import './styles.scss';

export const LoginPage = (): JSX.Element => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [serverErrorValidation, setServerErrorValidation] = React.useState(false);

  const onSubmit = React.useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      if (serverErrorValidation) {
        setServerErrorValidation(false);
      }

      try {
        await dispatch(nativeLogin({ email, password, isChecked: false }));
        notify.success('You are successfully logged in');
        history.push('/');
      } catch (error) {
        notify.error(error.response.data.message);
        if (error.response.data.code === 'VALIDATION') {
          setServerErrorValidation(true);
        }
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
