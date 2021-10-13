import * as React from 'react';
import companyLogo from '../../../../../public/assets/img/company-logo-2x.png';
import forgotPasswordDoneIcon from '../../../../../public/assets/img/forgot-password-complete-icon.svg';
import { OcForgotPasswordComponent } from '@openchannel/react-common-components/dist/ui/auth/organisms';
import { errorMessages, email, required } from '@openchannel/react-common-components/dist/ui/form/lib';
import { resetPassword } from '../../../common/store/session/actions';
import './styles.scss';

const ForgotPassword = (): JSX.Element => {
  const [inputValue, setInputValue] = React.useState('');
  const [inputError, setInputError] = React.useState('');
  const [showResultPage, setShowResultPage] = React.useState(false);

  const invalidMassage = () => errorMessages.email();
  const validateEmail = () => email();
  const requiredField = () => required();

  const onChange = (e: any) => {
    setInputValue(e.target.value);
    if (validateEmail()(e.target.value) !== null) {
      setInputError(invalidMassage);
    } else {
      setInputError('');
    }
  };

  const onSubmit = async () => {
    if (validateEmail()(inputValue) === null) {
      await resetPassword(inputValue);
      setShowResultPage(true);
      setInputValue('');
    }
  };

  return (
    <div className="bg-container pt-sm-5">
      <div className="forgot-pass-position">
        <OcForgotPasswordComponent
          inputProps={{
            value: inputValue,
            onChange,
          }}
          companyLogoUrl={companyLogo}
          loginUrl="/login"
          showResultPage={showResultPage}
          forgotPasswordDoneUrl={forgotPasswordDoneIcon}
          signupUrl="/signup"
          onSubmit={onSubmit}
          inputError={inputError}
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
