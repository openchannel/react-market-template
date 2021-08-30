import * as React from 'react';
import { useDispatch } from 'react-redux';

import { tryLoginByRefreshToken } from '../store/session';
import { useTypedSelector } from './useTypedSelector';

export const useAuth = () => {
  const { isLoading, isExist } = useTypedSelector(({ session }) => session);
  const dispatch = useDispatch();

  const checkSession = React.useCallback(async () => await dispatch(tryLoginByRefreshToken()), []);

  return {
    isLoading,
    isExist,
    checkSession,
  };
};
