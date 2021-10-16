import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
  OcError,
  OcButtonComponent,
  OcLabelComponent,
  OcCheckboxComponent,
} from '@openchannel/react-common-components/dist/ui/common/atoms';
import { AppFormModel } from '@openchannel/react-common-components';
import { OcForm } from '@openchannel/react-common-components/dist/ui/form/organisms';

import companyLogo from '../../../../../public/assets/img/company-logo-2x.png';

import { getUserInviteInfoByToken } from '../../store/join';

import './styles.scss';

// todo: connect 'terms' control with oc-form
// todo: add 'disabled' attr to the fields or use Ref to find email field and disable it

const InvitedSignUpPage = (): JSX.Element => {
  const { inviteId } = useParams<{ inviteId?: string }>();
  const history = useHistory();
  const dispatch = useDispatch();
  const [formConfig, setFormConfig] = React.useState<AppFormModel>();
  const [isExpired, setIsExpired] = React.useState(false);
  const [isTermsChecked, setTermsChecked] = React.useState(false);

  React.useEffect(() => {
    if (!inviteId) {
      return history.replace('/');
    }

    const loadInfo = async () => {
      const info = await dispatch(getUserInviteInfoByToken(inviteId));
      const { redirect, isExpired, formConfig } = info as unknown as {
        redirect: boolean;
        isExpired: boolean;
        formConfig: AppFormModel;
      };

      if (redirect) {
        return history.replace('/');
      }

      setIsExpired(isExpired);
      setFormConfig(formConfig);
    };

    loadInfo();
  }, []);

  const onChangeTerms = React.useCallback(() => {
    setTermsChecked((prev) => !prev);
  }, []);

  const onSubmit = React.useCallback(
    (values) => {
      // todo: add terms check and send request
      if (!isTermsChecked) {
        return;
      }

      // const request = merge(this.userInviteData, this.formResultData);
    },
    [isTermsChecked],
  );

  return (
    <div className="bg-container pt-sm-5">
      <div className="card border-card signup-position">
        <div className="card-body">
          {isExpired && <h5 className="text-primary">Sorry! Your invite token has been expired!</h5>}
          {!isExpired && formConfig && (
            <>
              <div className="text-center">
                <img alt="Company" className="img-fluid mb-4 company-logo" src={companyLogo} />
              </div>
              <div className="text-center">
                <h4 className="mb-1">Sign Up</h4>
                <OcLabelComponent className="mb-3">Enter your account details below</OcLabelComponent>
              </div>
              <OcForm formJsonData={formConfig} onSubmit={onSubmit} successButtonText="Sign Up" />
              <div className="form-group">
                <div className="d-flex align-items-start">
                  <OcCheckboxComponent onClick={onChangeTerms} checked={isTermsChecked} />
                  <div className="font-s">
                    I agree to&nbsp;
                    <a
                      className="font-s font-med"
                      href="https://my.openchannel.io/terms-of-service"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms of Service
                    </a>
                    &nbsp;and&nbsp;
                    <a
                      className="font-s font-med"
                      href="https://my.openchannel.io/data-processing-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Data Processing Policy
                    </a>
                  </div>
                  <OcError />
                </div>
              </div>
              {/*<OcButtonComponent customClass="btn-block mt-5" type="primary" text="Sign Up" />*/}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitedSignUpPage;
