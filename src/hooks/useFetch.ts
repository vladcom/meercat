import { useState, useRef, useCallback, useMemo } from 'react';
import memoize from 'lodash/memoize';
import useIsMounted from './useIsMounted';

type RequestFunctionType<T> = (params: any) => Promise<T>;
type SetErrorType = (response: any) => void;
type SetResponseType<T> = (response: T) => void;
type FormatResponseType<T> = (response: any) => T;

interface UseFetchOptions<T> {
  requestFunction: RequestFunctionType<T>;
  withCache?: boolean;
  withLoading?: boolean;
  formatResponse?: FormatResponseType<T>;
  setResponse?: SetResponseType<T>;
  setError?: SetErrorType;
  initialLoading?: boolean;
}

interface UseFetchReturnType<T> {
  loading: boolean;
  fetch: (params: any) => Promise<{ response?: T; error?: any }>;
  setErrorWrapper: SetErrorType;
}

const checkResponseForError = async (response: any) => {
  if (response && response.error) {
    throw response;
  }
};

/**
 * useFetch hook for fetching data
 * @param {Function} requestFunction
 * @param {boolean} [withCache]
 * @param {boolean} [withLoading]
 * @param {Function} [formatResponse]
 * @param {Function} [setResponse]
 * @param {Function} [setError]
 * @param {boolean} [initialLoading]
 * @return {{loading: boolean, fetch: function}}
 */
const useFetch = <T>({
  setError,
  setResponse,
  formatResponse,
  requestFunction,
  withCache = false,
  withLoading = false,
  initialLoading = false,
}: UseFetchOptions<T>): UseFetchReturnType<T> => {
  const isMounted = useIsMounted();
  const cache = useRef<{ [key: string]: T }>({});
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const getCacheKey = useMemo(
    () =>
      memoize((data: any) => {
        return () => JSON.stringify(data);
      }),
    []
  );
  const setResponseWrapper = useCallback(
    (response: any) => {
      if (!isMounted.current || !setResponse) {
        return 0;
      }

      setResponse(formatResponse ? formatResponse(response) : response);
    },
    [setResponse, formatResponse, isMounted]
  );
  const setErrorWrapper = useCallback(
    (response: any) => {
      if (!isMounted.current || !setError) {
        return 0;
      }

      setError(response);
    },
    [setError, isMounted]
  );
  const setLoadingWrapper = useCallback(
    (status: boolean) => {
      if (!isMounted.current || !withLoading) {
        return 0;
      }

      setLoading(status);
    },
    [setLoading, withLoading, isMounted]
  );

  const fetch = useCallback(
    async (params: any): Promise<{ response?: T; error?: any }> => {
      if (withCache && cache.current[getCacheKey(params)()]) {
        const response = cache.current[getCacheKey(params)()];

        setResponseWrapper(response);

        return { response };
      }

      setLoadingWrapper(true);

      try {
        const response = await requestFunction(params);

        if (!isMounted.current) {
          return 0 as any;
        }

        await checkResponseForError(response);

        if (withCache) {
          cache.current[getCacheKey(params)()] = response;
        }

        setResponseWrapper(response);

        return { response: formatResponse ? formatResponse(response) : response };
      } catch (error) {
        setErrorWrapper(error);
        return { error };
      } finally {
        setLoadingWrapper(false);
      }
    },
    [
      withCache,
      isMounted,
      getCacheKey,
      formatResponse,
      requestFunction,
      setErrorWrapper,
      setLoadingWrapper,
      setResponseWrapper,
    ]
  );

  return { loading, fetch, setErrorWrapper };
};

export default useFetch;
