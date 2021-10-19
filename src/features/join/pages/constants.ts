import { email, errorMessages, password } from '@openchannel/react-common-components/dist/ui/form/lib';

export const invalidMassageEmail = () => errorMessages.email();
export const validateEmail = () => email();
export const validatePassword = () => password();
export const requiredField = () => errorMessages.required();
export const invalidMassagePassword = () => errorMessages.password();
