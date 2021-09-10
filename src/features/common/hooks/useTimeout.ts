import * as React from 'react';

export const useTimeout = (
  callback: React.EffectCallback,
  delay: number | undefined,
): { reset: React.EffectCallback; clear: React.EffectCallback } => {
  const callbackRef = React.useRef(callback);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    timeoutRef.current = setTimeout(() => callbackRef.current(), delay);
  }, [delay]);

  const set = React.useCallback(() => {
    timeoutRef.current = setTimeout(() => callbackRef.current(), delay);
  }, [delay]);

  const clear = React.useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  React.useEffect(() => {
    set();
    return clear;
  }, [delay, set, clear]);

  const reset = React.useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  return { reset, clear };
};
