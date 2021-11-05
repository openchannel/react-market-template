import { OcEditUserFormConfig } from '@openchannel/react-common-components/dist/ui/auth/organisms';
import { ORGANIZATION_PREFIX, ACCOUNT_PREFIX } from './constants';

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
