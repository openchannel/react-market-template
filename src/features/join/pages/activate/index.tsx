import * as React from 'react';
import { OcActivation } from '@openchannel/react-common-components/dist/ui/auth/organisms';
import companyLogo from '../../../../../public/assets/img/company-logo-2x.png';
import { getUserToken, requiredField } from '../constants';
import { isEmptyInputValue } from '@openchannel/react-common-components/dist/ui/form/lib';
import { useDispatch } from 'react-redux';
import { activeUserAccount } from '../../../common/store/session/actions';
import { useLocation } from 'react-router-dom';
import './styles.scss';

const ActivatePage = (): JSX.Element => {
  const [inputValue, setInputValue] = React.useState('');
  const [inputError, setInputError] = React.useState('');
  const dispatch = useDispatch();
  const location = useLocation();

  const onChange = React.useCallback((e: { target: HTMLInputElement }) => {
    setInputValue(e.target.value);
    console.log('e.target.value', e.target.value);
    if (isEmptyInputValue(e.target.value)) {
      setInputError(requiredField);
    } else {
      setInputError('');
    }
  }, []);

  const onSubmit = React.useCallback(async () => {
    if (isEmptyInputValue(inputValue)) {
      try {
        const userToken = getUserToken(location);
        await dispatch(activeUserAccount(userToken || inputValue));
      } catch {
        //
      }
    }
    if (isEmptyInputValue(inputValue)) {
      setInputError(requiredField);
    }
    console.log('1');
  }, []);
  return (
    <div className="bg-container pt-sm-5">
      <div className="activation-position">
        <OcActivation
          signupUrl="/signup"
          companyLogoUrl={companyLogo}
          resendActivationUrl="/resend-activation"
          inputProps={{
            value: inputValue,
            onChange,
          }}
          inputError={inputError}
          handleButtonClick={onSubmit}
        />
      </div>
    </div>
  );
};

export default ActivatePage;
