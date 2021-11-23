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
  const companyFormWithDefDates = {
    ...companyForm,
    fields: companyForm?.fields?.map((field) =>
      field.type.includes('date') ? { ...field, defaultValue: new Date() } : field,
    ),
  };
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

  return <OcForm formJsonData={companyFormWithDefDates as AppFormModel} onSubmit={handleSubmit} service={apps} />;
};

export default CompanyDetails;
