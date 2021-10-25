import * as React from 'react';
import { noop, cloneDeep, keyBy } from 'lodash';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import {
  OcEditUserFormConfig,
  OcSignupComponent,
  TypeFieldModel,
  TypeModel,
} from '@openchannel/react-common-components/dist/ui/auth/organisms';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';

import { getSearchParams } from '../../../common/libs/helpers';
import { nativeSignup } from '../../../common/store/session';
import { getUserTypes, getUserAccountTypes } from '../../../common/store/user-types/actions';
import companyLogo from '../../../../../public/assets/img/company-logo-2x.png';
import './styles.scss';

const mockConfig = [
  {
    name: 'Default',
    organization: {
      type: 'default',
      typeData: {
        fields: [],
      },
      includeFields: ['name', 'customData.company'],
    },
    account: {
      type: 'default',
      typeData: {
        fields: [],
      },
      includeFields: ['name', 'email'],
    },
    fieldsOrder: ['name', 'email', 'org--name', 'password'],
  },
  {
    name: 'Custom',
    organization: {
      type: 'custom-user-type',
      typeData: {
        fields: [],
      },
      includeFields: ['name', 'customData.about-my-company'],
    },
    account: {
      type: 'custom-account-type',
      typeData: {
        fields: [],
      },
      includeFields: ['name', 'username', 'email', 'customData.about-me'],
    },
  },
];

const SignupPage = (): JSX.Element => {
  const history = useHistory();
  const dispatch = useDispatch();
  const searchParams = React.useMemo(() => getSearchParams(window.location.search), []);
  const [serverErrorValidation, setServerErrorValidation] = React.useState(false);
  // eslint-disable-next-line
  const [newConfig, setNewConfig] = React.useState<any>(mockConfig);

  const injectTypeDataIntoConfigs = async (
    configs: OcEditUserFormConfig[],
    injectOrganizationTypes: boolean,
    injectAccountTypes: boolean,
  ): Promise<OcEditUserFormConfig[]> => {
    if (configs) {
      const organizationTypes = await getUserTypes(injectOrganizationTypes, configs);
      const accountTypes = await getUserAccountTypes(injectAccountTypes, configs);
      const mappedPrefixedOrgFields = {
        ...organizationTypes,
        list: organizationTypes.list.map((orgConfig) => ({
          ...orgConfig,
          fields: orgConfig?.fields?.map((field) => ({
            ...field,
            id: `org--${field.id}`,
          })),
        })),
      };
      const mappedPrefixedAccFields = {
        ...accountTypes,
        list: accountTypes.list.map((accConfig) => ({
          ...accConfig,
          fields: accConfig?.fields?.map((field) => ({
            ...field,
            id: `acc--${field.id}`,
          })),
        })),
      };
      const mappedConfigsPrefixed = configs.map((config) => ({
        ...config,
        account: {
          ...config.account,
          includeFields: config.account.includeFields.map((incField) => `acc--${incField}`),
        },
        fieldsOrder: config.fieldsOrder
          ? config?.fieldsOrder?.map((orderField) =>
              !orderField.includes('org--') ? `acc--${orderField}` : orderField,
            )
          : [],
        organization: {
          ...config.organization,
          includeFields: config.organization.includeFields.map((incField) => `org--${incField}`),
        },
      }));

      const accTypes = keyBy(mappedPrefixedAccFields.list, 'userAccountTypeId');
      const orgTypes = keyBy(mappedPrefixedOrgFields.list, 'userTypeId');
      const newConfigs = cloneDeep(mappedConfigsPrefixed) as OcEditUserFormConfig[];
      newConfigs
        .map((config) => {
          const accountTypeData = accTypes[config?.account?.type];
          const organizationTypeData = orgTypes[config?.organization?.type];
          let isInvalid = !(injectOrganizationTypes || injectAccountTypes);

          // put organization type
          if (injectOrganizationTypes) {
            if (organizationTypeData) {
              config.organization.typeData = organizationTypeData as TypeModel<TypeFieldModel>;
            } else {
              console.error(config.organization.type, ' is not a valid user type');
              isInvalid = true;
            }
          }
          // put account type
          if (injectAccountTypes) {
            if (accountTypeData) {
              config.account.typeData = accountTypeData as TypeModel<TypeFieldModel>;
            } else {
              console.error(config.account.type, ' is not a valid user account type');
              isInvalid = true;
            }
          }
          return isInvalid ? null : config;
        })
        .filter((config) => config);
      return newConfigs;
    } else return [];
  };
  React.useEffect(() => {
    injectTypeDataIntoConfigs(mockConfig, true, true).then((res) => {
      setNewConfig(res);
    });
  }, []);

  const onSubmit = React.useCallback(
    // eslint-disable-next-line
    async (values: any) => {
      console.log('!!! SIGN UP VALUES !!!', values);
      // for some reason its not working
      // const oldValidBody = {
      //   uname: values.accname,
      //   email: values.accemail,
      //   company: values.orgname,
      //   password: values.password,
      // };
      // And below config giving same errors, need to evaborate issue
      const validBody = {
        account: {
          name: values.accname,
          username: values.accname,
          email: values.accemail,
          customData: {},
        },
        organization: {
          name: values.orgname,
          username: values.accname,
          email: values.accemail,
          customData: {},
        },
        password: values.password,
      };
      console.log('Valid values !!!', validBody);

      if (serverErrorValidation) {
        setServerErrorValidation(false);
      }

      try {
        await dispatch(nativeSignup(validBody));
        Object.keys(searchParams).includes('returnUrl') ? history.push(searchParams.returnUrl) : history.push('/');
        // eslint-disable-next-line
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
      <div className="signup-position">
        <OcSignupComponent
          showSignupFeedbackPage={false}
          forgotPasswordDoneUrl="/forgot-password"
          loginUrl="/login"
          companyLogoUrl={companyLogo}
          enableTypesDropdown
          formConfigs={newConfig}
          onSubmit={onSubmit}
          enablePasswordField
          enableTermsCheckbox
          enableCustomTerms={false}
          defaultTypeLabelText=""
          customTermsDescription=""
          setFeedbackPageVisible={noop}
          goToActivationPage={noop}
          selectValue={{}}
          setSelectValue={noop}
          defaultEmptyConfigsErrorMessage="There are no configuration"
          selectConfigOptions={[]}
          ordinaryTermsDescription={
            <>
              I agree to{' '}
              <Link to="/" className="edit-user-form__content__link">
                Terms of service
              </Link>{' '}
              and{' '}
              <Link className="edit-user-form__content__link" to="/">
                Data Processing Policy
              </Link>
            </>
          }
        />
      </div>
    </div>
  );
};

export default SignupPage;
// const json = [
// 	{
// 		name: 'Default',
// 		organization: {
// 			type: 'default',
// 			typeData: {
// 				userTypeId: 'default',
// 				label: 'Default',
// 				description: null,
// 				createdDate: 1614078094448,
// 				fields: [
// 					{
// 						id: 'name',
// 						label: 'Company',
// 						type: 'text',
// 						attributes: {
// 							maxChars: null,
// 							required: true,
// 							minChars: null,
// 							group: null,
// 						},
// 					},
// 					{
// 						id: 'customData.long-text',
// 						label: 'Long text',
// 						type: 'longText',
// 						attributes: {
// 							maxChars: null,
// 							required: null,
// 							minChars: null,
// 						},
// 					},
// 					{
// 						id: 'customData.label',
// 						label: 'Label',
// 						type: 'text',
// 						attributes: {
// 							maxChars: null,
// 							required: null,
// 							minChars: null,
// 						},
// 					},
// 					{
// 						id: 'customData.list',
// 						label: 'list',
// 						type: 'multiselectList',
// 						attributes: {
// 							minCount: null,
// 							maxCount: null,
// 							required: null,
// 						},
// 						options: [
// 							{
// 								value: 'a',
// 							},
// 							{
// 								value: 'b',
// 							},
// 							{
// 								value: 'c',
// 							},
// 						],
// 					},
// 					{
// 						id: 'customData.image',
// 						label: 'Image',
// 						type: 'singleImage',
// 						attributes: {
// 							width: null,
// 							required: null,
// 							hash: null,
// 							accept: null,
// 							height: null,
// 							group: null,
// 						},
// 					},
// 					{
// 						id: 'customData.multi-apps',
// 						label: 'Multi Apps',
// 						type: 'multiApp',
// 						attributes: {
// 							minCount: null,
// 							maxCount: null,
// 							required: null,
// 							group: null,
// 						},
// 					},
// 				],
// 			},
// 			includeFields: ['name', 'customData.company'],
// 		},
// 		account: {
// 			type: 'default',
// 			typeData: {
// 				userAccountTypeId: 'default',
// 				label: 'Default',
// 				description: null,
// 				createdDate: 1612362086311,
// 				fields: [
// 					{
// 						id: 'name',
// 						label: 'Name',
// 						type: 'text',
// 						attributes: {
// 							required: false,
// 						},
// 					},
// 					{
// 						id: 'email',
// 						label: 'Email',
// 						type: 'emailAddress',
// 						attributes: {
// 							required: true,
// 						},
// 					},
// 					{
// 						id: 'username',
// 						label: 'Username',
// 						type: 'text',
// 						attributes: {
// 							maxChars: null,
// 							required: false,
// 							minChars: null,
// 						},
// 					},
// 				],
// 			},
// 			includeFields: ['name', 'email'],
// 		},
// 		fieldsOrder: ['name', 'email', 'org--name', 'password'],
// 	},
// 	{
// 		name: 'Custom',
// 		organization: {
// 			type: 'custom-user-type',
// 			typeData: {
// 				userTypeId: 'custom-user-type',
// 				label: 'Custom User Type',
// 				description: null,
// 				createdDate: 1618486903732,
// 				fields: [
// 					{
// 						id: 'name',
// 						label: 'Company name',
// 						type: 'text',
// 						attributes: {
// 							maxChars: null,
// 							required: true,
// 							minChars: null,
// 						},
// 					},
// 					{
// 						id: 'customData.about-my-company',
// 						label: 'About my company',
// 						description: 'Long Text',
// 						type: 'longText',
// 						attributes: {
// 							maxChars: null,
// 							required: null,
// 							minChars: null,
// 							group: null,
// 						},
// 					},
// 					{
// 						id: 'customData.multi-app',
// 						label: 'Multi App',
// 						type: 'multiApp',
// 						attributes: {
// 							minCount: null,
// 							maxCount: null,
// 							required: null,
// 							group: null,
// 						},
// 					},
// 					{
// 						id: 'customData.summary',
// 						label: 'Summary',
// 						description: '',
// 						type: 'text',
// 						attributes: {
// 							maxChars: null,
// 							required: true,
// 							minChars: null,
// 							group: null,
// 						},
// 					},
// 					{
// 						id: 'customData.image',
// 						label: 'Image',
// 						description: '',
// 						type: 'singleImage',
// 						attributes: {
// 							width: null,
// 							required: null,
// 							hash: null,
// 							accept: null,
// 							height: null,
// 							group: null,
// 						},
// 					},
// 					{
// 						id: 'customData.terms-of-service-url',
// 						label: 'Terms Of Service Url',
// 						description: '',
// 						type: 'websiteUrl',
// 						attributes: {
// 							required: null,
// 							group: null,
// 						},
// 					},
// 					{
// 						id: 'customData.images',
// 						label: 'Images',
// 						description: '',
// 						defaultValue: [],
// 						type: 'multiImage',
// 						attributes: {
// 							width: null,
// 							minCount: null,
// 							maxCount: null,
// 							required: null,
// 							hash: null,
// 							accept: null,
// 							height: null,
// 							group: null,
// 						},
// 					},
// 					{
// 						id: 'customData.support-url',
// 						label: 'Support Url',
// 						description: '',
// 						type: 'websiteUrl',
// 						attributes: {
// 							required: null,
// 							group: null,
// 						},
// 					},
// 					{
// 						id: 'customData.description',
// 						label: 'Description',
// 						description: '',
// 						type: 'richText',
// 						attributes: {
// 							maxChars: null,
// 							required: null,
// 							minChars: null,
// 							group: null,
// 						},
// 					},
// 					{
// 						id: 'customData.contact-email',
// 						label: 'Contact Email',
// 						description: '',
// 						type: 'emailAddress',
// 						attributes: {
// 							required: null,
// 							group: null,
// 						},
// 					},
// 					{
// 						id: 'customData.categories',
// 						label: 'Categories',
// 						description: '',
// 						defaultValue: [],
// 						type: 'multiselectList',
// 						attributes: {
// 							minCount: null,
// 							maxCount: null,
// 							required: null,
// 							group: null,
// 						},
// 						options: [
// 							{
// 								value: 'Productivity',
// 							},
// 							{
// 								value: 'File Management',
// 							},
// 						],
// 						placeholder: 'Add categories',
// 					},
// 					{
// 						id: 'customData.dfa-tags',
// 						label: 'DFA tags',
// 						description: '',
// 						type: 'dynamicFieldArray',
// 						attributes: {
// 							ordering: 'append',
// 							minCount: null,
// 							rowLabel: null,
// 							maxCount: null,
// 							required: null,
// 							group: null,
// 						},
// 						fields: [
// 							{
// 								id: 'number-tags',
// 								label: 'Number Tags',
// 								defaultValue: [],
// 								type: 'numberTags',
// 								attributes: {
// 									minCount: null,
// 									maxCount: null,
// 									required: null,
// 									group: null,
// 								},
// 							},
// 							{
// 								id: 'tags',
// 								label: 'Tags',
// 								defaultValue: [],
// 								type: 'tags',
// 								attributes: {
// 									minCount: null,
// 									maxCount: null,
// 									required: null,
// 									group: null,
// 								},
// 							},
// 							{
// 								id: 'dfa-2',
// 								label: 'dfa 2',
// 								type: 'dynamicFieldArray',
// 								attributes: {
// 									ordering: 'append',
// 									minCount: null,
// 									rowLabel: null,
// 									maxCount: null,
// 									required: null,
// 									group: null,
// 								},
// 								fields: [
// 									{
// 										id: 'number',
// 										label: 'number',
// 										type: 'number',
// 										attributes: {
// 											min: null,
// 											max: null,
// 											required: null,
// 											group: null,
// 										},
// 									},
// 									{
// 										id: 'boolean-tags',
// 										label: 'Boolean Tags',
// 										defaultValue: [],
// 										type: 'booleanTags',
// 										attributes: {
// 											minCount: null,
// 											maxCount: null,
// 											required: null,
// 											group: null,
// 										},
// 									},
// 								],
// 							},
// 						],
// 					},
// 				],
// 			},
// 			includeFields: ['name', 'customData.about-my-company'],
// 		},
// 		account: {
// 			type: 'custom-account-type',
// 			typeData: {
// 				userAccountTypeId: 'custom-account-type',
// 				label: 'Custom Account Type',
// 				description: null,
// 				createdDate: 1618487066263,
// 				fields: [
// 					{
// 						id: 'name',
// 						label: 'You name',
// 						type: 'text',
// 						attributes: {
// 							maxChars: null,
// 							required: true,
// 							minChars: null,
// 						},
// 					},
// 					{
// 						id: 'username',
// 						label: 'Username',
// 						type: 'text',
// 						attributes: {
// 							required: false,
// 						},
// 					},
// 					{
// 						id: 'email',
// 						label: 'Email',
// 						type: 'emailAddress',
// 						attributes: {
// 							required: true,
// 						},
// 					},
// 					{
// 						id: 'customData.about-me',
// 						label: 'About me',
// 						type: 'text',
// 						attributes: {
// 							maxChars: null,
// 							required: false,
// 							minChars: null,
// 							group: null,
// 						},
// 					},
// 				],
// 			},
// 			includeFields: ['name', 'username', 'email', 'customData.about-me'],
// 		},
// 	},
// ];
