import * as React from 'react';
import companyLogo from '../../../../../public/assets/img/company-logo-2x.png';
import forgotPasswordDoneIcon from '../../../../../public/assets/img/forgot-password-complete-icon.svg';
import { OcForgotPasswordComponent } from '@openchannel/react-common-components/dist/ui/auth/organisms';
import './styles.scss';

const ForgotPassword = (): JSX.Element => {
  console.log('1');

  return (
    <div className="bg-container pt-sm-5">
      <div className="forgot-pass-position">
        <OcForgotPasswordComponent
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          inputProps={console.log('click')}
          companyLogoUrl={companyLogo}
          loginUrl="/login"
          showResultPage={false}
          forgotPasswordDoneUrl={forgotPasswordDoneIcon}
          signupUrl="/signup"
          onClick={console.log('2')}
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
