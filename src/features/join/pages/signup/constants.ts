export const ACCOUNT_PREFIX = 'acc--';
export const ORGANIZATION_PREFIX = 'org--';

export const mockConfig = [
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

export const enablePasswordField = true;
export const enableTermsCheckbox = true;
