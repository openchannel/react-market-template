import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { OcLoginComponent } from '@openchannel/react-common-components/dist/ui/auth/organisms';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';

import { nativeLogin } from '../../../common/store/session';
import companyLogo from '../../../../../public/assets/img/company-logo-2x.png';
import './styles.scss';

const noop = () => {};

const LoginPage = (): JSX.Element => {
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
        history.push('/');
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
      <div className="login-position">
        <OcLoginComponent
          signupUrl="/signup"
          forgotPwdUrl="/forgot-password"
          handleSubmit={onSubmit}
          onActivationLinkClick={noop}
          companyLogoUrl={companyLogo}
          isIncorrectEmail={serverErrorValidation}
        />
      </div>
    </div>
  );
};

export default LoginPage;
