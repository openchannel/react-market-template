import isEmpty from 'lodash.isempty';

export const isNonEmpty = <T>(value: T) => {
  return !isEmpty(value);
};

export { isEmpty };
