import * as React from 'react';
import { useTimeout } from '../hooks';

export const useDebounce = (callback: () => void, delay: number, dependencies: unknown[]): void => {
  const { reset, clear } = useTimeout(callback, delay);
  React.useEffect(reset, [...dependencies, reset]);
  React.useEffect(clear, []);
};
