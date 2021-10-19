import isEmpty from 'lodash.isempty';

export const isNonEmpty = <T>(value: T) => {
  return !isEmpty(value);
};

export const getSearchParams = (search: string) => {
  const hashes = search.slice(search.indexOf('?') + 1).split('&');
  const params: { [key: string]: string } = {};
  hashes.forEach((hash) => {
    const [key, val] = hash.split('=');
    params[key] = decodeURIComponent(val);
  });
  return params;
};

export { isEmpty };
