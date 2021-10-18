import { email, errorMessages } from '@openchannel/react-common-components/dist/ui/form/lib';

export const invalidMassage = () => errorMessages.email();
export const validateEmail = () => email();
export const requiredField = () => errorMessages.required();
