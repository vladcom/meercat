import { useEffect, useRef } from 'react';

/**
 * Hook for check if component is mounted
 *
 * Example:
 * ...
 * const isMounted = useIsMounted();
 * useEffect(() => {
 *   if (isMounted.current) {
 *     console.log('Component is mounted');
 *   }
 * }, []);
 * ...
 *
 * @return {React.MutableRefObject<boolean>}
 */
const useIsMounted = () => {
  const isMounted = useRef(true);

  useEffect(() => () => {
    isMounted.current = false;
  }, []);

  return isMounted;
};

export default useIsMounted;
