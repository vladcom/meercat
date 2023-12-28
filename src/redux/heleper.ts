/* eslint-disable @typescript-eslint/no-explicit-any */
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { useEffect, useMemo, useRef, useState } from 'react';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
/*
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error;
}

/*
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(
  error: unknown
): error is { data: { message: string }; status: number } {
  return (
    typeof error === 'object' &&
    error != null &&
    'data' in error &&
    typeof error.data === 'object' &&
    error.data != null &&
    'message' in error.data &&
    typeof (error as any).data.message === 'string'
  );
}

export function useDebounceSelector<T, S>(
  selector: (state: S) => T,
  time = 100,
  equalityFn?: (left: T, right: T) => boolean
) {
  const useTypedAppSelector: TypedUseSelectorHook<S> = useSelector;
  const [state, setState] = useState<{ data: T | undefined }>({ data: undefined });
  const result = useRef<T>();
  const data = useTypedAppSelector<T>(selector, equalityFn);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (result.current !== data) {
        result.current = data;
        setState({ data });
      }
    }, time);

    return () => clearTimeout(handler);
  }, [data, time]);

  return useMemo(() => state.data, [state.data]);
}
