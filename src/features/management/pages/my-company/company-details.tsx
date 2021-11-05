import * as React from 'react';
import { useDispatch } from 'react-redux';
import { apps } from '@openchannel/react-common-services';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { AppFormModel } from '@openchannel/react-common-components/dist/ui/form/models';
import { OcForm, OcFormFormikHelpers, OcFormValues } from '@openchannel/react-common-components/dist/ui/form/organisms';

import { useTypedSelector } from 'features/common/hooks';
import { clearUserCompanyForm, getUserCompanyForm, saveUserCompany } from 'features/common/store/user-types/actions';

const CompanyDetails: React.FC = () => {
  const dispatch = useDispatch();
  const { companyForm } = useTypedSelector(({ userTypes }) => userTypes);

  React.useEffect(() => {
    dispatch(getUserCompanyForm());

    return () => {
      dispatch(clearUserCompanyForm());
    };
  }, []);

  const handleSubmit = async (value: OcFormValues, { setErrors, setSubmitting }: OcFormFormikHelpers) => {
    try {
      await dispatch(saveUserCompany(value));
      notify.success('Your company details has been updated');
      // eslint-disable-next-line
    } catch (e: any) {
      if (e.errors != null) {
        setErrors(e.errors);
      }
    }

    setSubmitting(false);
  };

  if (companyForm == null) {
    return null;
  }

  // todo: temporary disable render 'date' and 'datetime' fields
  const trimmedForm = {
    ...companyForm,
    fields: companyForm.fields!.filter((f) => f.type !== 'datetime' && f.type !== 'date'),
  };

  return <OcForm formJsonData={trimmedForm as AppFormModel} onSubmit={handleSubmit} service={apps} />;
};

export default CompanyDetails;
