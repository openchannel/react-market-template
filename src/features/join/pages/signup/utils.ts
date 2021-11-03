import { OcEditUserFormConfig } from '@openchannel/react-common-components/dist/ui/auth/organisms';
import { enablePasswordField, enableTermsCheckbox, ORGANIZATION_PREFIX, ACCOUNT_PREFIX } from './constants';

export const prefixedConfigs = (configs: OcEditUserFormConfig[]) =>
  configs.length > 0
    ? configs.map((config) => ({
        ...config,
        account: {
          ...config.account!,
          includeFields: config!.account!.includeFields!.map(
            (incField) => `${config.account.type}+${ACCOUNT_PREFIX}${incField}`,
          ),
          typeData: {
            ...config.account.typeData,
            fields: config!.account!.typeData!.fields!.map((field) => ({
              ...field,
              id: `${config.account.type}+${ACCOUNT_PREFIX}${field.id}`,
            })),
          },
        },
        fieldsOrder: config.fieldsOrder
          ? config.fieldsOrder.map((orderField) =>
              !orderField.includes(`${ORGANIZATION_PREFIX}`)
                ? `${config.account.type}+${ACCOUNT_PREFIX}${orderField}`
                : `${config.organization!.type}+${orderField}`,
            )
          : [],
        organization: {
          ...config.organization!,
          includeFields: config!.organization!.includeFields!.map(
            (incField) => `${config.organization!.type}+${ORGANIZATION_PREFIX}${incField}`,
          ),
          typeData: {
            ...config!.organization!.typeData,
            fields: config!.organization!.typeData!.fields!.map((field) => ({
              ...field,
              id: `${config.organization!.type}+${ORGANIZATION_PREFIX}${field.id}`,
            })),
          },
        },
      }))
    : [];

export const requiredPrefixedFields = (configs: OcEditUserFormConfig[]) =>
  configs.map((config) => ({
    name: config.name,
    fields: [
      ...config.account!.typeData.fields!.filter((field) => field.attributes.required === true),
      ...config.organization!.typeData.fields!.filter((field) => field.attributes.required === true),
      enablePasswordField
        ? {
            id: 'password',
            name: 'password',
            type: 'password',
            label: 'Password',
            defaultValue: '',
            attributes: { required: true },
          }
        : undefined,
      enableTermsCheckbox
        ? {
            id: 'terms',
            name: 'terms',
            type: 'checkbox',
            defaultValue: false,
            attributes: { required: true },
          }
        : undefined,
    ].filter(Boolean),
  }));
