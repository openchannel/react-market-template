import * as React from 'react';
import companyLogo from '../../../../../public/assets/img/company-logo-2x.png';
import forgotPasswordDoneIcon from '../../../../../public/assets/img/forgot-password-complete-icon.svg';
import { OcForgotPasswordComponent } from '@openchannel/react-common-components/dist/ui/auth/organisms';
import { errorMessages, email, isEmptyInputValue } from '@openchannel/react-common-components/dist/ui/form/lib';
import { resetPassword } from '../../../common/store/session/actions';
import { useDispatch } from 'react-redux';
import './styles.scss';

const ForgotPassword = (): JSX.Element => {
  const [inputValue, setInputValue] = React.useState('');
  const [inputError, setInputError] = React.useState('');
  const [showResultPage, setShowResultPage] = React.useState(false);
  const [loadingRequest, setLoadingRequest] = React.useState(false);
  const dispatch = useDispatch();

  const invalidMassage = React.useCallback(() => errorMessages.email(), []);
  const requiredMassage = React.useCallback(() => errorMessages.required(), []);
  const validateEmail = React.useCallback(() => email(), []);

  const onChange = (e: { target: HTMLInputElement }) => {
    setInputValue(e.target.value);
    if (validateEmail()(e.target.value) !== null) {
      setInputError(invalidMassage);
    } else {
      setInputError('');
    }
    if (isEmptyInputValue(e.target.value)) {
      setInputError(requiredMassage);
    }
  };

  const onSubmit = async () => {
    setLoadingRequest(true);
    if (validateEmail()(inputValue) === null && !isEmptyInputValue(inputValue)) {
      await dispatch(resetPassword(inputValue));
      setShowResultPage(true);
      setInputValue('');
    }
    if (isEmptyInputValue(inputValue)) {
      setInputError(requiredMassage);
    }
    setLoadingRequest(false);
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
          process={loadingRequest}
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
